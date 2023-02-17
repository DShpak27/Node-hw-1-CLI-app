const { nanoid } = require("nanoid");
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join("db", "contacts.json");

// Читання файла с JSON формату і парс в Object
async function readJson() {
    try {
        const data = await fs.readFile(contactsPath, "utf-8"); // повертає String
        const contactList = JSON.parse(data); // парсить String з (JSON) в Object (Array)
        return contactList; // повертає Promise
    } catch (error) {
        return error.message;
    }
}

// Виведення списку контактів в консоль
async function listContacts() {
    try {
        const contactsList = await readJson();
        console.table(contactsList); // виведення даних у вигляді таблиці в консоль
    } catch (error) {
        return error.message;
    }
}

// Пошук контакта по id
async function getContactById(id) {
    try {
        const contactsList = await readJson();
        const searchedContact = contactsList.find(
            (contact) => contact.id === id
        );
        console.log(searchedContact);
        return searchedContact; // повертає Promise з об'єктом контакта з необхідним id
    } catch (error) {
        return error.message;
    }
}

// Видалення контакту з файлу з контактами по id
async function removeContact(id) {
    try {
        const contactList = await readJson(); // прочитали файл JSON, зберегли у змінну посилання на розібраний із JSON об'єкт
        const updatedContactList = contactList.filter(
            (contact) => contact.id !== id // створюємо новий список контактів з видаленим контактом по id
        );
        const updatedContactListJson = JSON.stringify(
            updatedContactList,
            null,
            "\t"
        ); // конвертуємо масив контактів в строку JSON
        fs.writeFile(contactsPath, updatedContactListJson); //перезаписуємо файл contacts.json новим контентом
        console.log("The contact was successfully removed");
    } catch (error) {
        return error.message;
    }
}

// додаємо контакт у файл contacts.json
async function addContact(name, email, phone) {
    try {
        const contactList = await readJson();
        const newContact = { id: nanoid(), name, email, phone };
        const isExistingContact = Boolean(
            contactList.find((contact) => contact.email === newContact.email)
        );
        if (isExistingContact) {
            console.log("The contact is already in the list");
            return;
        }
        const newContactList = JSON.stringify(
            [newContact, ...contactList],
            null,
            "\t"
        );
        fs.writeFile(contactsPath, newContactList);
        console.log("Contact was successfully added");
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};
