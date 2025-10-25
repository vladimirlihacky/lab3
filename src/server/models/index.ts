export type Matcher<T> = (t: T) => boolean;
export type Pagination = { limit?: number, offset?: number }

export const MatchAll = (t: any) => true; 
export const MatchNothing = (t: any) => false;

export type Updater<T> = (t: T) => T;

export type Maybe<T> = T | null | undefined;

export interface Repo {
    getById<T extends Model>(entity: new () => T, id: number): Promise<Maybe<T>>;
    findOne<T extends Model>(entity: new () => T, matching: Matcher<T>): Promise<Maybe<T>>;
    find<T extends Model>(entity: new () => T, matching: Matcher<T>, pagination?: Pagination): Promise<T[]>;
    update<T extends Model>(entity: new () => T, matching: Matcher<T>, update: Updater<T>): Promise<T[]>;
    create<T extends Model>(entity: new () => T, data: any): Promise<Maybe<T>>;
    delete<T extends Model>(entity: new () => T, matching: Matcher<T>): Promise<T[]>;
}

export abstract class Model {
    private static repo: Repo;

    public static setRepo(repo: Repo) {
        Model.repo = repo;
    }

    public static getById<T extends Model>(this: new () => T, id: number): Promise<Maybe<T>> {
        return Model.repo.getById(this, id);
    }

    public static findOne<T extends Model>(this: new () => T, matching: Matcher<T>): Promise<Maybe<T>> {
        return Model.repo.findOne(this, matching);
    }

    public static find<T extends Model>(this: new () => T, matching: Matcher<T>, pagination?: Pagination): Promise<T[]> {
        return Model.repo.find(this, matching, pagination);
    }

    public static update<T extends Model>(this: new () => T, matching: Matcher<T>, update: Updater<T>): Promise<T[]> {
        return Model.repo.update(this, matching, update);
    }

    public static create<T extends Model>(this: new () => T, data: any): Promise<Maybe<T>> {
        return Model.repo.create(this, data);
    }

    public static delete<T extends Model>(this: new () => T, matching: Matcher<T>): Promise<T[]> {
        return Model.repo.delete(this, matching);
    }

    public id!: number;

    public static validate(data: any): Boolean {
        return true;
    };

    public serialize(): string {
        return JSON.stringify(this);
    }

    public static deserialize<T extends Model>(this: new () => T, str: string): T {
        const data = JSON.parse(str);
        const instance = new this();
        Object.assign(instance, data);
        return instance;
    }
}