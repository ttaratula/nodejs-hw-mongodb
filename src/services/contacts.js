import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
    return Contact.find({});
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactByIdService = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
  };
  