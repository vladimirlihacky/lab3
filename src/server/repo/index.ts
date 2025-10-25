import { Model, type Repo, type Maybe, type Matcher, type Updater, type Pagination } from "../models"
import { writeFile, readFile } from "node:fs/promises"
import { existsSync } from "node:fs";

export class JSONRepo implements Repo {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    private async readData(): Promise<any> {
        if (!existsSync(this.filePath)) {
            return {
                __metadata: {
                    lastIds: {}
                }
            };
        }
        const data = await readFile(this.filePath, 'utf-8');
        const parsed = JSON.parse(data || '{}');

        if (!parsed.__metadata) {
            parsed.__metadata = { lastIds: {} };
        }
        if (!parsed.__metadata.lastIds) {
            parsed.__metadata.lastIds = {};
        }
        return parsed;
    }

    private async writeData(data: any): Promise<void> {
        await writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    private getEntityName<T extends Model>(entity: new () => T): string {
        return entity.name;
    }

    private async getNextId<T extends Model>(entity: new () => T): Promise<number> {
        const data = await this.readData();
        const entityName = this.getEntityName(entity);

        if (!data.__metadata.lastIds[entityName]) {
            data.__metadata.lastIds[entityName] = 1;
        } else {
            data.__metadata.lastIds[entityName]++;
        }

        await this.writeData(data);
        return data.__metadata.lastIds[entityName];
    }

    private async getEntities<T extends Model>(entity: new () => T): Promise<T[]> {
        const data = await this.readData();
        const entityName = this.getEntityName(entity);
        return (data[entityName] || []).map((item: any) => {
            return (entity as any).deserialize(JSON.stringify(item));
        });
    }

    private async saveEntities<T extends Model>(entity: new () => T, entities: T[]): Promise<void> {
        const data = await this.readData();
        const entityName = this.getEntityName(entity);

        const maxId = entities.reduce((max, e) => Math.max(max, e.id), 0);
        if (!data.__metadata.lastIds[entityName] || data.__metadata.lastIds[entityName] < maxId) {
            data.__metadata.lastIds[entityName] = maxId;
        }

        data[entityName] = entities.map(e => {
            const obj: any = {};
            Object.keys(e).forEach(key => {
                obj[key] = (e as any)[key];
            });
            return obj;
        });

        await this.writeData(data);
    }

    async getById<T extends Model>(entity: new () => T, id: number): Promise<Maybe<T>> {
        const entities = await this.getEntities(entity);
        return entities.find(e => e.id === id) || null;
    }

    async findOne<T extends Model>(entity: new () => T, matching: Matcher<T>): Promise<Maybe<T>> {
        const entities = await this.getEntities(entity);
        return entities.find(matching) || null;
    }

    async find<T extends Model>(entity: new () => T, matching: Matcher<T>, pagination?: Pagination): Promise<T[]> {
        const entities = await this.getEntities(entity);
        const { limit = 30, offset = 0 } = pagination ?? { limit: 30, offset: 0 };
        return entities.filter(matching).slice(offset, offset + limit);
    }

    async update<T extends Model>(entity: new () => T, matching: Matcher<T>, update: Updater<T>): Promise<T[]> {
        const entities = await this.getEntities(entity);
        const updated: T[] = [];

        for (let i = 0; i < entities.length; i++) {
            if (matching(entities[i])) {
                entities[i] = update(entities[i]);
                updated.push(entities[i]);
            }
        }

        if (updated.length > 0) {
            await this.saveEntities(entity, entities);
        }

        return updated;
    }

    async create<T extends Model>(entity: new () => T, data: any): Promise<Maybe<T>> {
        const instance = new entity();
        const nextId = await this.getNextId(entity);

        Object.assign(instance, { ...data, id: nextId });
        const entities = await this.getEntities(entity);
        entities.push(instance);
        await this.saveEntities(entity, entities);

        return instance;
    }

    async delete<T extends Model>(entity: new () => T, matching: Matcher<T>): Promise<T[]> {
        const entities = await this.getEntities(entity);
        const toDelete: T[] = [];
        const toKeep: T[] = [];

        for (const e of entities) {
            if (matching(e)) {
                toDelete.push(e);
            } else {
                toKeep.push(e);
            }
        }

        if (toDelete.length > 0) {
            await this.saveEntities(entity, toKeep);
        }

        return toDelete;
    }
}