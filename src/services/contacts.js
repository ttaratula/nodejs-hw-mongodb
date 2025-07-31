import { Contact } from '../models/contact.js';

export const getAllContacts = async ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' }) => {
  const skip = (page - 1) * perPage;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find()
    .sort({ [sortBy]: sortDirection })  // сортування
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}; 

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export async function createContact(contactData) {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContact = async (id, updateData) => {
  const updated = await Contact.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteContactById = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

