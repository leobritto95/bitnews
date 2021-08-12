import React, {Component} from 'react';
import {Share} from 'react-native';
import {displayName as nomeApp} from '../../../app.json';

import {IconNavbar} from '../../assets/styles';

export default class Compartilhador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: this.props.feed,
    };
  }

  compartilhar = () => {
    const {feed} = this.state;
    const mensagem = `${feed.url} \n\n Enviado por ${nomeApp}\n Baixe agora: http://play.google.com/store`;
    Share.share({
      title: feed.title,
      message: mensagem,
    });
  };

  render = () => {
    return (
      <IconNavbar
        name="sharealt"
        size={28}
        onPress={() => {
          this.compartilhar();
        }}
      />
    );
  };
}
