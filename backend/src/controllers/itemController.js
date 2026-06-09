const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los ítems (búsqueda, filtrado y paginación)
exports.getItems = async (req, res) => {
  try {
    const { categoryId, search, limit, offset } = req.query;

    const queryOptions = {
      where: {},
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    if (categoryId) {
      queryOptions.where.categoryId = parseInt(categoryId);
    }

    if (search) {
      queryOptions.where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (limit) {
      queryOptions.take = parseInt(limit);
    }
    if (offset) {
      queryOptions.skip = parseInt(offset);
    }

    const items = await prisma.item.findMany(queryOptions);
    const totalCount = await prisma.item.count({ where: queryOptions.where });

    res.status(200).json({
      items,
      totalCount,
      limit: parseInt(limit) || null,
      offset: parseInt(offset) || 0,
    });
  } catch (error) {
    console.error('Error al obtener ítems:', error);
    res.status(500).json({ error: 'Error al obtener los ítems de la base de datos' });
  }
};

// Obtener un ítem específico por ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!item) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error al obtener el ítem:', error);
    res.status(500).json({ error: 'Error al obtener el detalle del ítem' });
  }
};

// Crear un nuevo ítem
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, imageUrl, categoryId } = req.body;

    if (!title || !description || price === undefined || !imageUrl || !categoryId) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!categoryExists) {
      return res.status(400).json({ error: 'La categoría especificada no existe' });
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      message: 'Elemento creado con éxito',
      item: newItem,
    });
  } catch (error) {
    console.error('Error al crear el ítem:', error);
    res.status(500).json({ error: 'Error al registrar el nuevo ítem en la base de datos' });
  }
};

// Actualizar un ítem
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, categoryId } = req.body;

    const itemExists = await prisma.item.findUnique({ where: { id: parseInt(id) } });
    if (!itemExists) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl) updateData.imageUrl = imageUrl;
    
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });
      if (!categoryExists) {
        return res.status(400).json({ error: 'La categoría especificada no existe' });
      }
      updateData.categoryId = parseInt(categoryId);
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      message: 'Elemento actualizado con éxito',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Error al actualizar el ítem:', error);
    res.status(500).json({ error: 'Error al actualizar el ítem en la base de datos' });
  }
};

// Eliminar un ítem
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const itemExists = await prisma.item.findUnique({ where: { id: parseInt(id) } });
    if (!itemExists) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }

    await prisma.item.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Elemento eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el ítem:', error);
    res.status(500).json({ error: 'Error al eliminar el ítem de la base de datos' });
  }
};

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};
