import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Header} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-simple-toast';
import Moment from 'react-moment';

import {
  CentralizadoNaMesmaLinha,
  ConteudoNoticia,
  Espacador,
  DireitaDaMesmaLinha,
  Likes,
  BitNews,
  NomeTitulo,
  Cabecalho,
  IconNavbar,
} from '../../assets/styles';
import Compartilhador from '../../components/Compartilhador';
import {ScrollView} from 'react-native';
import {CardContent} from 'react-native-cards';
import {
  getFeed,
  usuarioGostou,
  gostar,
  desgostar,
  getImagem,
  likesAlive,
  comentariosAlive,
} from '../../api';

export default class Detalhes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedId: this.props.navigation.state.params.feedId,
      feed: null,
      gostou: false,
      podeGostar: false,
      podeComentar: false,
    };
  }

  verificarUsuarioGostou = () => {
    const {feedId} = this.state;

    usuarioGostou(feedId)
      .then(resultado => {
        this.setState({gostou: resultado.likes > 0});
      })
      .catch(error => {
        console.error('erro verificando se usuario gostou: ' + error);
      });
  };

  carregarFeed = () => {
    const {feedId} = this.state;

    getFeed(feedId)
      .then(feed => {
        this.setState({feed}, () => {
          this.verificarUsuarioGostou();
        });
      })
      .catch(error => {
        console.error('erro atualizando o feed' + error);
      });
  };

  componentDidMount = () => {
    likesAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          this.setState({
            podeGostar: true,
          });
        } else {
          this.setState(
            {
              podeGostar: false,
            },
            () => {
              Toast.show('Não é possível registrar likes agora :(', Toast.LONG);
            },
          );
        }
      })
      .catch(error => {
        console.log('erro verificando disponibilidade de servico: ' + error);
      });

    comentariosAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          this.setState({
            podeComentar: true,
          });
        } else {
          this.setState(
            {
              podeComentar: false,
            },
            () => {
              Toast.show(
                'Não é possível comentar sobre a publicação agora :(',
                Toast.LONG,
              );
            },
          );
        }
      })
      .catch(error => {
        console.log('erro verificando disponibilidade de servico: ' + error);
      });

    this.carregarFeed();
  };

  mostrarSlides = () => {
    const slides = this.state.feed.blobs.map(img => getImagem(img.image));

    return (
      <SliderBox
        dotColor={'#5995ed'}
        inactiveDotColor={'#22223b'}
        resizeMethod={'resize'}
        resizeMode={'cover'}
        // eslint-disable-next-line react-native/no-inline-styles
        dotStyle={{
          width: 15,
          height: 15,
          borderRadius: 15,
          marginHorizontal: 5,
          borderColor: 'white',
          borderWidth: 2,
        }}
        images={slides}
      />
    );
  };

  like = () => {
    const {feedId} = this.state;
    gostar(feedId)
      .then(resultado => {
        if (resultado.situacao === 'ok') {
          this.carregarFeed();
          Toast.show('Obrigado pela sua avaliação!', Toast.LONG);
        } else {
          Toast.show(
            'Ocorreu um erro nessa operação. Tente novamente mais tarde',
            Toast.LONG,
          );
        }
      })
      .catch(error => {
        console.error('erro registrando like:' + error);
      });
  };

  dislike = () => {
    const {feedId} = this.state;
    desgostar(feedId)
      .then(resultado => {
        if (resultado.situacao === 'ok') {
          this.carregarFeed();
        } else {
          Toast.show(
            'Ocorreu um erro nessa operação. Tente novamente mais tarde',
            Toast.LONG,
          );
        }
      })
      .catch(error => {
        console.error('erro registrando dislike:' + error);
      });
  };

  render = () => {
    const {feed, gostou, podeGostar, podeComentar} = this.state;
    const usuario = SyncStorage.get('user');

    if (feed) {
      return (
        <>
          <Header
            leftComponent={
              <IconNavbar
                size={28}
                name="left"
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            }
            centerComponent={
              <>
                <CentralizadoNaMesmaLinha>
                  <BitNews>BitNews</BitNews>
                </CentralizadoNaMesmaLinha>
              </>
            }
            rightComponent={
              <CentralizadoNaMesmaLinha>
                <Compartilhador feed={feed} />
                <Espacador />
                {podeGostar && gostou && usuario && (
                  <Icon
                    name="heart"
                    size={28}
                    color={'#ff0000'}
                    onPress={() => {
                      this.dislike();
                    }}
                  />
                )}
                {podeGostar && !gostou && usuario && (
                  <IconNavbar
                    name="hearto"
                    size={28}
                    onPress={() => {
                      this.like();
                    }}
                  />
                )}
              </CentralizadoNaMesmaLinha>
            }
            containerStyle={Cabecalho}
          />
          <ScrollView>
            <CardView cardElevation={2} cornerRadius={0}>
              <View>
                <CardContent>
                  <NomeTitulo>{feed.title}</NomeTitulo>
                </CardContent>
                <CardContent>
                  <DireitaDaMesmaLinha>
                    <Text>
                      <Moment
                        element={Text}
                        parse="YYYY-MM-DD HH:mm"
                        format="DD/MM/YYYY HH:mm">
                        {feed.datetime}
                      </Moment>
                      h
                    </Text>
                  </DireitaDaMesmaLinha>
                </CardContent>
                <Espacador />
                {this.mostrarSlides()}
                <View style={{padding: 8}}>
                  <Espacador />
                  <ConteudoNoticia>{feed.content}</ConteudoNoticia>
                  <Espacador />
                  <DireitaDaMesmaLinha>
                    <Icon name="heart" size={28} color={'#ff0000'}>
                      <Likes> {feed.likes}</Likes>
                    </Icon>
                    <Espacador />
                    {podeComentar && usuario && (
                      <Icon
                        name="message1"
                        size={28}
                        onPress={() => {
                          this.props.navigation.navigate('Comentarios', {
                            feedId: feed._id,
                            news: feed,
                          });
                        }}
                      />
                    )}
                  </DireitaDaMesmaLinha>
                  <Espacador />
                </View>
              </View>
            </CardView>
          </ScrollView>
        </>
      );
    } else {
      return null;
    }
  };
}
