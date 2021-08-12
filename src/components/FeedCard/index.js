import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Card, CardContent, CardImage} from 'react-native-cards';
import Icon from 'react-native-vector-icons/AntDesign';
import Moment from 'react-moment';

import {
  NomeTitulo,
  ConteudoNoticia,
  DireitaDaMesmaLinha,
  Likes,
} from '../../assets/styles';

export default class FeedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: this.props.feed,
      navegador: this.props.navegador,
    };
  }

  render = () => {
    const {feed, navegador} = this.state;
    return (
      <TouchableOpacity
        onPress={() => navegador.navigate('Detalhes', {feedId: feed._id})}>
        <Card>
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
          <CardImage source={feed.blobs[0].file} />
          <CardContent>
            <ConteudoNoticia numberOfLines={3}>{feed.content}</ConteudoNoticia>
          </CardContent>
          <CardContent>
            <DireitaDaMesmaLinha>
              <Icon name="heart" size={28} color={'#ff0000'}>
                <Likes> {feed.likes}</Likes>
              </Icon>
            </DireitaDaMesmaLinha>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };
}
