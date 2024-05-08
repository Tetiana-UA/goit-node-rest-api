import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

//створюємо базові функції readContacts і writeContacts
async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

// далі наші базові функції будемо викликати в  асинхронних функціях, де будемо працювати з контактами за контретною умовою. Ці асинхронні функції потім будуть викликатися в контролерах у файлі contactControllers.js
async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(id) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];
  console.log(removedContact);
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function addContact({ name, email, phone }) {
  const contacts = await readContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateById(id, data) {
  const contacts = await readContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { id, ...data };

  await writeContacts(contacts);
  return contacts[index];
}

//експорт
export default {
  addContact,
  removeContact,
  getContactById,
  listContacts,
  updateById,
};
