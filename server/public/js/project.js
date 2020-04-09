import { sendData, getData } from './api.js'

let project

const initProject = async () => {
  const url = decodeURI(window.location.href)
  const regex = /projects\/(.*)$/
  const projectName = url.match(regex)[1]
  document.title = `LabeliT - ${projectName}`

  const result = await getData(`/projects/${projectName}`)
  if (result.status !== true) {
    displayMessage(result.status, 'Project could not be loaded')
    return
  }

  project = result.project

  document.getElementById(
    'projectHeader'
  ).innerHTML = `<a href="/projects/">Projects</a> > ${project.name}`

  document.getElementById('projectDescription').innerText = project.description
  document.getElementById('projectProgress').innerHTML = `<div
    class="progress-bar bg-success"
    role="progressbar"
    style="width: ${project.progress}%;"
    aria-valuenow="${project.progress}"
    aria-valuemin="0"
    aria-valuemax="100"
  >${project.progress}%
  </div>`

  document.getElementById(
    'projectCategories'
  ).innerHTML = project.categories.reduce((outputHTML, category) => {
    return (
      outputHTML +
      `<button type="button" class="btn btn-${category.color} btn-sm" onclick="window.project.showEditCategory('${category._id}', this)">${category.name} <span class="badge badge-light">${category.keyUp}</span><span class="sr-only">key</span>
    </button><span class="remove middle" onclick="window.project.removeCategory('${category._id}')" hidden></span>
    `
    )
  }, '')
  document.getElementById('texts').innerHTML = project.texts.reduce(
    (outputHTML, text) => {
      let status = ''
      if (text.status === 'confirmed')
        status = '<span class="confirmed"></span>'
      else if (text.status === 'unconfirmed')
        status = '<span class="unconfirmed"></span>'
      return (
        outputHTML +
        `<div><a href="/text/${text._id}">${text.name}</a>${status}
    `
      )
    },
    ''
  )
}

const updateProject = async () => {
  const newProjectName = document.getElementById('projectNameInput').value

  const result = await sendData(`/projects/${project._id}`, 'PUT', {
    name: newProjectName,
    description: document.getElementById('projectDescriptionInput').value,
  })
  if (result.status === true) {
    document.getElementById('projectForm').hidden = true
    history.pushState(null, '', `/projects/${newProjectName}`)
    initProject()
    displayMessage(result.status, 'Project successfully updated')
  } else {
    displayMessage(result.status, 'Project could not be updated')
  }
}

const removeProject = async () => {
  const confirmed = confirm(
    `Do you realy want to delete the project ${project.name}? This can not be reversed! `
  )
  if (!confirmed) return
  const result = await sendData(`/projects/${project._id}`, 'DELETE')
  if (result.status === true) {
    window.location.pathname = '/projects'
  } else {
    displayMessage(result.status, 'Could not remove project')
  }
}

const showNewCategory = () => {
  Array.from(document.getElementsByClassName('remove')).forEach((element) => {
    element.hidden = true
  })
  const current = document.getElementById('categoryForm').hidden
  if (current === false) {
    const button = document.getElementById('submitCategory')
    if (button.innerText === 'Update') {
      button.innerText = 'Add'
      document.getElementById('categoryName').value = ''
      document.getElementById('categoryKey').value = ''
      document.getElementById('categoryColor').value = ''
      button.onclick = () => window.project.addCategory()
      return
    }
  }
  document.getElementById('categoryForm').hidden = !current
}

const addCategory = async () => {
  const categoryNameEl = document.getElementById('categoryName')
  const categoryKeyEl = document.getElementById('categoryKey')
  const categoryColorEl = document.getElementById('categoryColor')
  const colorArr = categoryColorEl.value.split(',')

  const result = await sendData(`/projects/${project._id}/categories`, 'POST', {
    name: categoryNameEl.value,
    key: categoryKeyEl.value,
    color: colorArr[0],
    colorHex: colorArr[1],
  })
  if (result.status === true) {
    categoryNameEl.value = ''
    categoryKeyEl.value = ''
    categoryColorEl.value = ''
    initProject()
    displayMessage(result.status, 'Category successfully added')
  } else {
    displayMessage(result.status, 'Could not create add category')
  }
}

const showEditCategory = async (categoryId, node) => {
  Array.from(document.getElementsByClassName('remove')).forEach((element) => {
    element.hidden = true
  })
  node.nextSibling.hidden = false
  document.getElementById('categoryForm').hidden = false
  const category = project.categories.find(
    (category) => category._id === categoryId
  )
  const button = document.getElementById('submitCategory')
  document.getElementById('categoryName').value = category.name
  document.getElementById('categoryKey').value = category.key
  document.getElementById('categoryColor').value =
    category.color + ',' + category.colorHex
  console.log(document.getElementById('categoryColor').value)
  button.innerText = 'Update'
  button.onclick = () => window.project.updateCategory(categoryId)
}

const updateCategory = async (categoryId) => {
  const categoryNameEl = document.getElementById('categoryName')
  const categoryKeyEl = document.getElementById('categoryKey')
  const categoryColorEl = document.getElementById('categoryColor')
  const colorArr = categoryColorEl.value.split(',')

  const result = await sendData(
    `/projects/${project._id}/categories/${categoryId}`,
    'PUT',
    {
      name: categoryNameEl.value,
      key: categoryKeyEl.value,
      color: colorArr[0],
      colorHex: colorArr[1],
    }
  )
  if (result.status === true) {
    initProject()
    categoryNameEl.value = ''
    categoryKeyEl.value = ''
    categoryColorEl.value = ''
    const button = document.getElementById('submitCategory')
    button.innerText = 'Add'
    button.onclick = window.project.addCategory
    displayMessage(result.status, 'Category successfully updated')
  } else {
    displayMessage(result.status, 'Could not update category')
  }
}

const removeCategory = async (categoryId) => {
  const result = await sendData(
    `/projects/${project._id}/categories/${categoryId}`,
    'DELETE'
  )
  if (result.status === true) {
    initProject()
    displayMessage(result.status, 'Category successfully removed')
  } else {
    displayMessage(result.status, 'Could not remove Category')
  }
}

const checkTexts = async () => {
  const result = await sendData(`/texts/check`, 'POST', {
    projectId: project._id,
    password: document.getElementById('projectPasswordC').value,
  })

  if (result.status === true) {
    initProject()
    displayMessage(result.status, 'All texts checked')
  } else {
    displayMessage(result.status, 'Could not check texts')
  }
}

const exportTexts = async () => {
  const folderPath = document.getElementById('exportPath').value
  const password = document.getElementById('projectPasswordE').value
  if (folderPath === '') {
    displayMessage(false, 'Export path can not be empty')
  } else if (password === '') {
    displayMessage(false, 'Password can not be empty')
  }
  const result = await sendData(`/texts/export`, 'POST', {
    projectId: project._id,
    projectName: project.name,
    folderPath,
    password,
  })

  if (result.status === true) {
    if (result.valid === false) {
      displayMessage(false, 'Invalid project password')
      return
    }
    displayMessage(result.status, 'Category successfully updated')
  } else {
    displayMessage(result.status, 'Could not create update category')
  }
}

const showProjectForm = () => {
  document.getElementById('projectNameInput').value = project.name
  document.getElementById('projectDescriptionInput').value = project.description
  document.getElementById('projectForm').hidden = !document.getElementById(
    'projectForm'
  ).hidden
}

const displayMessage = (status, message) => {
  const messageDiv = document.getElementById('message')
  if (status === true) {
    messageDiv.innerHTML = `<div class="alert alert-success" role="alert">${message}</div>`
  } else {
    messageDiv.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`
  }
}

export {
  initProject,
  updateProject,
  removeProject,
  addCategory,
  showEditCategory,
  updateCategory,
  removeCategory,
  exportTexts,
  checkTexts,
  showNewCategory,
  showProjectForm,
}
