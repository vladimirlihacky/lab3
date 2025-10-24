import { MatchAll } from "../models";
import { User } from "../models/user";
import { Router } from "express";
import { validateId } from "./validators";
import { Message } from "../models/message";
import { validateRole, validateStatus } from "../../common/validators";

const router = Router()

router.get('/', async (_, res) => {
    const users = await User.find(MatchAll);

    return res.json(users); 
})

router.get(
    '/:id', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const user = await User.getById(id); 

        if(!user) return res.status(404).json({ message: 'User not found' }); 

        return res.status(200).json(user);
    }
)

router.get(
    '/:id/friends', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const user = await User.getById(id); 

        if(!user) return res.status(404).json({ message: 'User not found' }); 

        const friends = await User.find(({ id }) => user.friendIds.includes(id));

        return res.status(200).json(friends);
    }
)

router.get(
    '/:id/messages', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const user = await User.getById(id); 

        if(!user) return res.status(404).json({ message: 'User not found' }); 

        const messages = await Message.find(({ id }) => user.messageIds.includes(id));

        return res.status(200).json(messages);
    }
)

router.post(
    '/:id/addFriend', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const friendId = Number(req.body.id); 

        const user = await User.getById(id);
        const friend = await User.getById(friendId); 

        if(!user || !friend) return res.status(404).json({ message: "User not found" });

        Promise.all([
            await User.update(
                (data) => data.id === id,
                //@ts-expect-error
                (data) => ({ ...data, friendIds: [...data.friendIds, friendId] })
            ),
            await User.update(
                (data) => data.id === friendId,
                //@ts-expect-error
                (data) => ({ ...data, friendIds: [...data.friendIds, id] })
            )
        ])

        return res.json(await User.getById(id))
    }
)

router.post(
    '/:id/removeFriend', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const friendId = Number(req.body.id); 

        const user = await User.getById(id);
        const friend = await User.getById(friendId); 

        if(!user || !friend) return res.status(404).json({ message: "User not found" });

        Promise.all([
            await User.update(
                (data) => data.id === id,
                //@ts-expect-error
                (data) => ({ ...data, friendIds: data.friendIds.filter(i => i !== friendId) })
            ),
            await User.update(
                (data) => data.id === friendId,
                //@ts-expect-error
                (data) => ({ ...data, friendIds: data.friendIds.filter(i => i !== id) })
            )
        ])

        return res.json(await User.getById(id))
    }
)

router.post(
    '/create', 
    async (req, res) => {
        const body = req.body; 

        if(!User.validate(body)) return res.status(400).json({ message: "Invalid user data" });

        const user = await User.create(body);

        return res.json(user);
    }
)

router.post(
    '/:id/update', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const body = req.body; 

        if(body.id) return res.status(400).json({ message: "ID is primary key and not allowed to change" })

        const [user] = await User.update(
            (user) => user.id === id, 
            (user) => ({ ...user, ...body })
        )

        return res.json(user);
    }
)

router.post(
    '/:id/setStatus/', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const { status } = req.body;

        if(!validateStatus(status)) return res.status(400).json({ message: "Invalid status" })

        const [user] = await User.update(
            (user) => user.id === id, 
            //@ts-expect-error
            (user) => ({ ...user, status })   
        )

        return res.json(user)
    }
)

router.post(
    '/:id/setRole/', 
    validateId, 
    async (req, res) => {
        const id = Number(req.params.id);
        const { role } = req.body;

        if(!validateRole(role)) return res.status(400).json({ message: "Invalid status" })

        const [user] = await User.update(
            (user) => user.id === id, 
            //@ts-expect-error
            (user) => ({ ...user, role })   
        )

        return res.json(user)
    }
)

export { router as userRouter };