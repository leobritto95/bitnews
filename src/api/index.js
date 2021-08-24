import SyncStorage from 'sync-storage';

const FEEDS_URL = 'http://172.29.1.1:5000';
const MENUTAGS_URL = 'http://172.29.1.2:5000';
const COMENTARIOS_URL = 'http://172.29.1.3:5000';
const LIKES_URL = 'http://172.29.1.4:5000';
const ARQUIVOS_URL = 'http://172.29.1.6/';

export const acessarUrl = async url => {
  let promise = null;

  try {
    const resposta = await fetch(url);
    if (resposta.ok) {
      promise = Promise.resolve(resposta.json());
    } else {
      promise = Promise.reject(resposta);
    }
  } catch (error) {
    promise = promise.reject(error);
  }

  return promise;
};

export const getFeeds = async pagina => {
  return acessarUrl(`${FEEDS_URL}/feeds/${pagina}`);
};

export const getFeed = async id => {
  return acessarUrl(`${FEEDS_URL}/feed/${id}`);
};

export const getFeedsPorBusca = async (busca, pagina) => {
  return acessarUrl(`${FEEDS_URL}/feeds-por-busca/${busca}/${pagina}`);
};

export const getFeedsPorTag = async (tag, pagina) => {
  return acessarUrl(`${FEEDS_URL}/feeds-por-tag/${tag}/${pagina}`);
};

export const getMenuTags = async () => {
  return acessarUrl(`${MENUTAGS_URL}/menutags`);
};

export const usuarioGostou = async newsId => {
  let promise = null;

  const usuario = SyncStorage.get('user');

  if (!usuario) {
    return {likes: 0};
  }

  const {account} = usuario;
  promise = acessarUrl(`${LIKES_URL}/gostou/${account}/${newsId}`);

  return promise;
};

export const gostar = async newsId => {
  let promise = null;

  const usuario = SyncStorage.get('user');
  if (usuario) {
    const {account} = usuario;
    promise = acessarUrl(`${LIKES_URL}/gostar/${account}/${newsId}`);
  }

  return promise;
};

export const desgostar = async newsId => {
  let promise = null;

  const usuario = SyncStorage.get('user');
  if (usuario) {
    const {account} = usuario;
    promise = acessarUrl(`${LIKES_URL}/desgostar/${account}/${newsId}`);
  }

  return promise;
};

export const getComentarios = async (newsId, pagina) =>
  acessarUrl(`${COMENTARIOS_URL}/comentarios/${newsId}/${pagina}`);

export const getImagem = imagem => {
  return {uri: ARQUIVOS_URL + imagem};
};

export const adicionarComentario = async (newsId, comment) => {
  let promise = null;

  const usuario = SyncStorage.get('user');
  if (usuario) {
    const {name, account} = usuario;
    promise = acessarUrl(
      `${COMENTARIOS_URL}/adicionar/${newsId}/${name}/${account}/${comment}`,
    );
  }

  return promise;
};

export const feedAlive = async () => acessarUrl(`${FEEDS_URL}/isalive`);

export const menuTagsAlive = async () => acessarUrl(`${MENUTAGS_URL}/isalive`);

export const comentariosAlive = async () =>
  acessarUrl(`${COMENTARIOS_URL}/isalive`);

export const likesAlive = async () => acessarUrl(`${LIKES_URL}/isalive`);

export const removerComentario = async newsId =>
  acessarUrl(`${COMENTARIOS_URL}/remover/${newsId}`);
