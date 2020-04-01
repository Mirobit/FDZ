const express = require('express')
const router = express.Router()
const projectsService = require('../../services/projects')

// Single
router.get('/:id', async (req, res) => {
  try {
    const project = await projectsService.get(req.params.id)
    res.json({ status: true, project })
  } catch (error) {
    console.log(error)
    res.json({ status: false })
  }
})

// All
router.get('/', async (req, res) => {
  try {
    const projects = await projectsService.list()
    res.json({ status: true, projects })
  } catch (error) {
    console.log(error)
    res.json({ status: false })
  }
})

// New
router.post('/', async (req, res) => {
  try {
    await projectsService.create({
      name: req.body.name,
      description: req.body.description,
      folderPath: req.body.folderPath,
      password: req.body.password
    })
    res.json({ status: true })
  } catch (error) {
    console.log(error)
    res.json({ status: false })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const project = await projectsService.update({
      name: req.body.id,
      descripion: req.body.description,
      filePath: req.body.filePath
    })
    res.json({ status: true, project })
  } catch (error) {
    console.log(error)
    res.json({ status: false })
  }
})

// Remove
router.delete('/:id', async (req, res) => {
  try {
    await projectsService.remove(req.params.id)
    res.json({ status: true })
  } catch (error) {
    console.log(error)
    res.json({ status: false })
  }
})

module.exports = router
