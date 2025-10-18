//variable to store the messages in the localstorage
const MSGS_KEY = "bv.messages";

//util to load the list of messages
export const getMessages = () =>
  JSON.parse(localStorage.getItem(MSGS_KEY) || "[]");

//saving the list
const saveMessages = (list) =>
  localStorage.setItem(MSGS_KEY, JSON.stringify(list));

//generating an id
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

//to create a new message
export const addMessage = (msg) => {
  const list = getMessages();
  list.push({ ...msg, id: genId() });
  saveMessages(list);
  return list;
};

//to update partially the list by id
export const updateMessage = (id, patch) => {
  const list = getMessages().map((m) => (m.id === id ? { ...m, ...patch } : m));
  saveMessages(list);
  return list;
};

//deleting the message
export const deleteMessage = (id) => {
  const next = getMessages().filter((m) => m.id !== id);
  saveMessages(next);
  return next;
};
