const convertToJson = res => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(res.statusText);
  }
};
const fetchAll = async e => {
  const data = await fetch('http://localhost:5000/pr10/fetchAll').then(convertToJson);
  console.log(data);
};

const fetchButton = document.getElementById('fetchButton');
fetchButton.addEventListener('click', fetchAll);
