import React from 'react';
import {FlatList, Text, Modal, TextInput, Alert} from 'react-native';
import {Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Swipeable from 'react-native-swipeable-row';
import SyncStorage from 'sync-storage';
import Moment from 'react-moment';

import 'moment-timezone';

import {
  Cabecalho,
  CentralizadoNaMesmaLinha,
  NomeTituloComentario,
  AutorComentario,
  ContenedorComentarios,
  ContenedorComentarioDoUsuario,
  ContenedorComentarioDeOutroUsuario,
  Comentario,
  EspacadorComentario,
  DataComentario,
  DivisorComentario,
  ContenedorNovoComentario,
  Espacador,
  ContenedorMensagem,
  Mensagem,
  IconNavbar,
} from '../../assets/styles';
import {View} from 'react-native';
import {
  getComentarios,
  adicionarComentario,
  removerComentario,
  comentariosAlive,
} from '../../api';

const TAMANHO_MAXIMO_COMENTARIO = 100;

export default class Comentarios extends React.Component {
  constructor(props) {
    super(props);
    const {feedId, news} = this.props.navigation.state.params;
    this.state = {
      feedId,
      news,

      comentarios: [],
      proximaPagina: 1,
      textoNovoComentario: '',

      carregando: false,
      atualizando: false,
      podeComentar: true,
      telaAdicaoVisivel: false,
    };
  }

  carregarComentarios = () => {
    const {feedId, comentarios, proximaPagina} = this.state;

    this.setState({
      carregando: true,
    });

    comentariosAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          this.setState(
            {
              podeComentar: true,
            },
            () => {
              getComentarios(feedId, proximaPagina)
                .then(maisComentarios => {
                  if (maisComentarios.length) {
                    this.setState({
                      proximaPagina: proximaPagina + 1,
                      comentarios: [...comentarios, ...maisComentarios],

                      atualizando: false,
                      carregando: false,
                    });
                  } else {
                    this.setState({
                      atualizando: false,
                      carregando: false,
                    });
                  }
                })
                .catch(error => {
                  console.error('erro exibindo comentarios: ' + error);
                });
            },
          );
        } else {
          this.setState({
            podeComentar: false,
          });
        }
      })
      .catch(error => {
        console.error(
          'erro verificando a disponibilidade do servico: ' + error,
        );
      });
  };

  componentDidMount = () => {
    this.carregarComentarios();
  };

  carregarMaisComentarios = () => {
    const {carregando} = this.state;
    if (carregando) {
      return;
    }

    this.carregarComentarios();
  };

  removerComentario = comentarioParaRemover => {
    removerComentario(comentarioParaRemover._id)
      .then(resultado => {
        if (resultado.situacao === 'ok') {
          this.setState(
            {
              proximaPagina: 1,
              comentarios: [],
            },
            () => {
              this.carregarComentarios();
            },
          );
        }
      })
      .catch(error => {
        console.error('erro removendo comentario: ' + error);
      });
  };

  confirmarRemocao = comentario => {
    Alert.alert(null, 'Remover o seu comentário?', [
      {text: 'NÃO', style: 'cancel'},
      {text: 'SIM', onPress: () => this.removerComentario(comentario)},
    ]);
  };

  mostrarComentarioDoUsuario = comentario => {
    return (
      <>
        <Swipeable
          rightButtonWidth={50}
          rightButtons={[
            <View style={{padding: 13}}>
              <Espacador />
              <Icon
                name="delete"
                color="#030303"
                size={28}
                onPress={() => {
                  this.confirmarRemocao(comentario);
                }}
              />
            </View>,
          ]}>
          <ContenedorComentarioDoUsuario>
            <AutorComentario>{'Você:'}</AutorComentario>
            <Comentario>{comentario.content}</Comentario>
            <DataComentario>
              <Moment
                element={Text}
                parse="YYYY-MM-DD HH:mm"
                format="DD/MM/YYYY HH:mm">
                {comentario.datetime}
              </Moment>
            </DataComentario>
          </ContenedorComentarioDoUsuario>
        </Swipeable>
        <EspacadorComentario />
      </>
    );
  };

  mostrarComentarioDeOutroUsuario = comentario => {
    return (
      <>
        <ContenedorComentarioDeOutroUsuario>
          <AutorComentario>{comentario.user.name}</AutorComentario>
          <Comentario>{comentario.content} </Comentario>
          <DataComentario>
            <Moment
              element={Text}
              parse="YYYY-MM-DD HH:mm"
              format="DD/MM/YYYY HH:mm">
              {comentario.datetime}
            </Moment>
          </DataComentario>
        </ContenedorComentarioDeOutroUsuario>
        <EspacadorComentario />
      </>
    );
  };

  atualizar = () => {
    this.setState(
      {atualizando: true, carregando: false, proximaPagina: 1, comentarios: []},
      () => {
        this.carregarComentarios();
      },
    );
  };

  adicionarComentario = () => {
    const {feedId, textoNovoComentario} = this.state;

    comentariosAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          this.setState(
            {
              podeComentar: true,
            },
            () => {
              adicionarComentario(feedId, textoNovoComentario)
                .then(resultado => {
                  if (resultado.situacao === 'ok') {
                    this.setState(
                      {
                        proximaPagina: 1,
                        comentarios: [],
                      },
                      () => {
                        this.carregarComentarios();
                      },
                    );
                  }
                })
                .catch(error => {
                  console.log(error);
                  console.log('erro adicionando comentario ' + error);
                });
            },
          );
        } else {
          this.setState({
            podeComentar: false,
          });
        }
      })
      .catch(error => {
        console.error('erro verificando disponibilidade do servico: ' + error);
      });

    this.mudarVisibilidadeTelaAdicao();
  };

  mudarVisibilidadeTelaAdicao = () => {
    const {telaAdicaoVisivel} = this.state;

    this.setState({telaAdicaoVisivel: !telaAdicaoVisivel});
  };

  atualizarTextoNovoComentario = texto => {
    this.setState({
      textoNovoComentario: texto,
    });
  };

  mostrarTelaAdicaoComentario = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          this.atualizar();
        }}>
        <ContenedorNovoComentario>
          <TextInput
            multiline={true}
            numberOfLines={3}
            editable={true}
            placeholder={'Digite um comentário'}
            maxLength={TAMANHO_MAXIMO_COMENTARIO}
            onChangeText={texto => {
              this.atualizarTextoNovoComentario(texto);
            }}
          />
          <DivisorComentario />
          <Espacador />
          <CentralizadoNaMesmaLinha>
            <Button
              icon={<Icon name="check" size={22} color="#fff" />}
              title=" Gravar"
              type="solid"
              onPress={() => {
                this.adicionarComentario();
              }}
            />
            <Espacador />
            <Button
              icon={<Icon name="closecircle" size={22} color="#fff" />}
              title=" Cancelar"
              type="solid"
              onPress={() => {
                this.mudarVisibilidadeTelaAdicao();
              }}
            />
          </CentralizadoNaMesmaLinha>
          <Espacador />
        </ContenedorNovoComentario>
      </Modal>
    );
  };

  mostrarComentarios = () => {
    const {news, comentarios, atualizando} = this.state;
    const usuario = SyncStorage.get('user');

    return (
      <>
        <Header
          leftComponent={
            <View>
              <IconNavbar
                name="left"
                size={28}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </View>
          }
          centerComponent={
            <CentralizadoNaMesmaLinha>
              <NomeTituloComentario>{news.title}</NomeTituloComentario>
            </CentralizadoNaMesmaLinha>
          }
          rightComponent={
            <IconNavbar
              name="pluscircleo"
              size={28}
              onPress={() => {
                this.mudarVisibilidadeTelaAdicao();
              }}
            />
          }
          containerStyle={Cabecalho}
        />
        <ContenedorComentarios>
          <FlatList
            data={comentarios}
            onEndReached={() => {
              this.carregarMaisComentarios();
            }}
            onEndReachedThreshold={0.1}
            onRefresh={() => {
              this.atualizar();
            }}
            refreshing={atualizando}
            keyExtractor={item => String(item._id)}
            renderItem={({item}) => {
              if (item.user.email === usuario.email) {
                return this.mostrarComentarioDoUsuario(item);
              } else {
                return this.mostrarComentarioDeOutroUsuario(item);
              }
            }}
          />
        </ContenedorComentarios>
      </>
    );
  };

  mostrarBotaoAtualizar = () => {
    return (
      <ContenedorMensagem>
        <Mensagem>Um dos nossos serviços não está funcionando :(</Mensagem>
        <Mensagem>Tente novamente mais tarde!</Mensagem>
        <Espacador />
        <Button
          icon={<Icon name="reload1" size={22} color="#fff" />}
          title="Tentar agora"
          type="solid"
          onPress={() => {
            this.carregarComentarios();
          }}
        />
      </ContenedorMensagem>
    );
  };

  mostrarMensagemCarregando = () => {
    return (
      <ContenedorMensagem>
        <Mensagem>Carregando comentarios. Aguarde...</Mensagem>
      </ContenedorMensagem>
    );
  };

  render = () => {
    const {comentarios, telaAdicaoVisivel, podeComentar} = this.state;

    if (podeComentar) {
      if (comentarios) {
        return (
          <>
            {this.mostrarComentarios()}
            {telaAdicaoVisivel && this.mostrarTelaAdicaoComentario()}
          </>
        );
      } else {
        return this.mostrarMensagemCarregando();
      }
    } else {
      return this.mostrarBotaoAtualizar();
    }
  };
}
