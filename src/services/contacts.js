import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export async function createContact(contactData) {
  const newContact = await Contact.create(contactData);
  return newContact;
}

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

