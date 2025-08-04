import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const result = await getAllContacts({
    userId: req.user.id,  // додаємо userId сюди
    page: Number(page),
    perPage: Number(perPage),
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);  // додаємо userId

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
  }

  const newContact = await createContact(
    { name, phoneNumber, email, isFavourite, contactType },
    req.user.id  // додаємо userId
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  const updatedContact = await updateContact(contactId, updateData, req.user.id);  // додаємо userId

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactById(contactId, req.user.id);  // додаємо userId

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
