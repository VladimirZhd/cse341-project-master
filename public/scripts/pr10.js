const convertToJson = res => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(res.statusText);
  }
};
const fetchAll = async e => {
  const data = await fetch('https://cse341vovazhdanov.herokuapp.com/prove/pr10/fetchAll').then(convertToJson);
  const list = document.getElementById('listElement');
  list.innerHTML = data.avengers.map(item => `<li>${item.name}</li>`).join('');
};

const addItem = async e => {
  const text = document.getElementById('text');
  await fetch('https://cse341vovazhdanov.herokuapp.com/prove/pr10/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: text.value }),
  });
  fetchAll();
  text.value = '';
};

const fetchButton = document.getElementById('fetchButton');
fetchButton.addEventListener('click', fetchAll);

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', addItem);
