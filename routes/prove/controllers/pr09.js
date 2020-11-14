const fetch = require('node-fetch');

const url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=10';
let prevApi;
let nextApi;

const convertToJson = res => {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(res.statusText);
  }
};

exports.getProve = async (req, res) => {
  const data = await fetch(url).then(convertToJson);
  if (data.previous) {
    prevApi = data.previous;
  } else {
    prevApi = null;
  }
  if (data.next) {
    nextApi = data.next;
  } else {
    nextApi = null;
  }
  res.render('pages/prove/pr09', {
    title: 'Prove Week 9',
    path: '/prove/pr09',
    pokemons: data.results,
    next: data.next,
    prev: data.previous,
  });
};

exports.getNext = async (req, res) => {
  const data = await fetch(nextApi).then(convertToJson);
  if (data.previous) {
    prevApi = data.previous;
  } else {
    prevApi = null;
  }
  if (data.next) {
    nextApi = data.next;
  } else {
    nextApi = null;
    return res.redirect('/prove/pr09');
  }
  res.render('pages/prove/pr09', {
    title: 'Prove Week 9',
    path: '/prove/pr09',
    pokemons: data.results,
    next: data.next,
    prev: data.previous,
  });
};

exports.getPrev = async (req, res) => {
  const data = await fetch(prevApi).then(convertToJson);
  if (data.previous) {
    prevApi = data.previous;
  } else {
    prevApi = null;
    return res.redirect('/prove/pr09');
  }
  if (data.next) {
    nextApi = data.next;
  } else {
    nextApi = null;
  }
  res.render('pages/prove/pr09', {
    title: 'Prove Week 9',
    path: '/prove/pr09',
    pokemons: data.results,
    next: data.next,
    prev: data.previous,
  });
};
