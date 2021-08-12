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
import noticiasEstaticas from '../../assets/dicionarios/noticias.js';
import {ScrollView} from 'react-native';
import {CardContent} from 'react-native-cards';

export default class Detalhes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedId: this.props.navigation.state.params.feedId,
      feed: null,
      gostou: false,
    };
  }

  carregarFeed = () => {
    const {feedId} = this.state;

    const feeds = noticiasEstaticas.news;
    const feedFiltrados = feeds.filter(feed => feed._id === feedId);

    if (feedFiltrados.length) {
      this.setState({
        feed: feedFiltrados[0],
      });
    }
  };

  componentDidMount = () => {
    this.carregarFeed();
  };

  mostrarSlides = () => {
    const slides = this.state.feed.blobs.map(img => img.file);

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
    const {feed} = this.state;
    const usuario = SyncStorage.get('user');

    console.log('adicionando like do usuário: ' + usuario.name);
    feed.likes++;

    this.setState({feed, gostou: true}, () =>
      Toast.show('Obrigado pela sua avaliação!', Toast.LONG),
    );
  };

  dislike = () => {
    const {feed} = this.state;
    const usuario = SyncStorage.get('user');

    console.log('removendo like do usuário: ' + usuario.name);
    feed.likes--;

    this.setState({feed, gostou: false});
  };

  render = () => {
    const {feed, gostou} = this.state;
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
                {gostou && usuario && (
                  <Icon
                    name="heart"
                    size={28}
                    color={'#ff0000'}
                    onPress={() => {
                      this.dislike();
                    }}
                  />
                )}
                {!gostou && usuario && (
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
                    {usuario && (
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
