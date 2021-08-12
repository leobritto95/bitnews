import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';

export const BitNews = styled.Text`
  padding: 8px;
  font-size: 18;
  color: #fff;
`;

export const NomeTag = styled.Text`
  padding: 8px;
  font-size: 16;
  color: #4a4e69;
`;

export const NomeTitulo = styled.Text`
  padding-top: 15px;
  font-size: 20;
  font-weight: bold;
  color: #22223b;
  text-align: center;
`;

export const NomeTituloComentario = styled.Text`
  font-size: 15;
  font-weight: bold;
  color: #fff;
  text-align: center;
`;

export const ConteudoNoticia = styled.Text`
  font-size: 18;
  color: #4a4e69;
  text-align: justify;
`;

export const Likes = styled.Text`
  font-size: 18;
  color: #4a4e69;
`;

export const EntradaNomeTitulo = styled.TextInput`
  height: 40px;
  width: 100%;
  background-color: #fff;
  border-color: #c7c7c7;
  border-width: 1;
  border-radius: 8px;
`;

export const CentralizadoNaMesmaLinha = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const EsquerdaDaMesmaLinha = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const DireitaDaMesmaLinha = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const Espacador = styled.View`
  flex-direction: row;
  padding: 8px;
`;

export const ContenedorMenu = styled.View`
  flex: 1;
  font-size: 18;
  background-color: #fff;
`;

export const DivisorMenu = styled.View`
  margin: 5px;
  border-bottom-width: 1;
  border-color: #3f6ea3;
`;

export const DivisorComentario = styled.View`
  margin: 5px;

  border-bottom-width: 1;
  border-color: #3f6ea3;
`;

export const ContenedorComentarios = styled.View`
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

export const ContenedorComentarioDoUsuario = styled.View`
  background-color: #e6dcc8;
`;

export const ContenedorComentarioDeOutroUsuario = styled.View`
  background-color: #eff2f1;
`;

export const EspacadorComentario = styled.View`
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const ContenedorNovoComentario = styled.View`
  margin-top: 100;
  align-self: center;
  width: 95%;
  border-color: #7ca982;
  border-width: 1;
  border-radius: 6;
  background-color: #fffcf9;
`;

export const AutorComentario = styled.Text`
  padding: 6px;
  font-size: 16;
  color: #283044;
`;

export const Comentario = styled.Text`
  padding: 6px;
  font-size: 16;
  color: #283044;
`;

export const DataComentario = styled.Text`
  padding: 6px;
  font-size: 16;
  color: #283044;
`;

export const IconNavbar = styled(Icon)`
  color: white;
`;

export const Cabecalho = {
  backgroundColor: '#22223b',
  justifyContent: 'space-evenly',
  borderBottomWidth: 0,
};
