import { Contact } from '../models/contact.js';

export const getAllContacts = async ({ userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = { userId };

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
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

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export async function createContact(contactData, userId) {
  const newContact = await Contact.create({ ...contactData, userId });
  return newContact;
};

export const updateContact = async (id, updateData, userId) => {
  const updated = await Contact.findOneAndUpdate(
    { _id: id, userId },
    updateData,
    { new: true, runValidators: true }
  );
  return updated;
};

export const deleteContactById = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
