// import { createServer } from 'node:http'

// const server = createServer((req, res) => {
    //res.write('hello world')

    //res.end()
//})

//server.listen(3000)

import { fastify } from "fastify";

//import { DatabaseMemory } from "./database-memory.js";

import { DatabasePostgres } from "./database-postgres.js";

//const database = new DatabaseMemory()

const database = new DatabasePostgres()

const server = fastify()

server.get('/videos', async (req) => {
    const search = req.query.search

    const videos = await database.list(search)
    
    return videos
})

server.post('/videos', async (req, res) => {
    const { title, description, duration } = req.body

    await database.create({ 
        title, 
        description, 
        duration
    })

    return res.status(201).send('Adicionado com sucesso!')
})

server.put('/videos/:id', async (req, res) => {
    const videoId = req.params.id

    const { title, description, duration } = req.body

    await database.update(videoId, { 
        title, 
        description, 
        duration
    })

    res.status(204).send('Atualizado com sucesso!')
})

server.delete('/videos/:id', async (req, res) => {
    const videoId = req.params.id

    await database.delete(videoId)

    res.status(204).send('Deletado com sucesso!')
})


server.listen({
    port: process.env.PORT ?? 3000
})