const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Conectar a MongoDB
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB', err));

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // Configurar Express para servir archivos estáticos desde 'public'
app.set('view engine', 'ejs');

// Modelo de datos
const Task = require('./task');

// Ruta principal
app.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('index', { tasks });
});

// Crear tarea
app.post('/tasks', async (req, res) => {
  const task = new Task({
    name: req.body.name,
    completed: false,
  });
  await task.save();
  res.redirect('/');
});

// Marcar tarea como completada
app.post('/api/tasks/:id/complete', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      task.completed = !task.completed;
      await task.save();
      res.json(task);
    } catch (error) {
      console.error('Error al marcar tarea como completada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Eliminar tarea
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  

// Agregar una ruta para consultar todas las tareas (GET)
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // Consultar una sola tarea por ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      res.json(task);
    } catch (error) {
      console.error('Error al obtener tarea por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  

// Definir el puerto
const port = 3000;
app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
