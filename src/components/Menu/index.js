import React, {Component} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';

import {
  NomeTag,
  ContenedorMenu,
  DivisorMenu,
  EsquerdaDaMesmaLinha,
  CentralizadoNaMesmaLinha,
} from '../../assets/styles';
import {LoginOptionsMenu} from '../../components/Login';
import tagsEstaticas from '../../assets/dicionarios/tags.json';
import Icon from 'react-native-vector-icons/AntDesign';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      atualizar: true,
      filtrar: props.filtragem,
    };
  }

  mostrarTags = tag => {
    const {filtrar} = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          filtrar(tag);
        }}>
        <DivisorMenu />
        <EsquerdaDaMesmaLinha>
          <CentralizadoNaMesmaLinha>
            <Icon name="caretright" color={'#283044'} />
            <NomeTag>{tag.name}</NomeTag>
          </CentralizadoNaMesmaLinha>
        </EsquerdaDaMesmaLinha>
      </TouchableOpacity>
    );
  };

  onLogin = usuario => {
    this.setState(
      {
        atualizar: true,
      },
      () => {
        Toast.show(
          'Você foi logado com sucesso com sua conta ' + usuario.signer,
          Toast.LONG,
        );
      },
    );
  };

  onLogout = signer => {
    this.setState(
      {
        atualizar: true,
      },
      () => {
        Toast.show('Você foi deslogado com sucesso de sua conta ' + signer);
      },
    );
  };

  render = () => {
    const {tags} = tagsEstaticas;

    return (
      <>
        <SafeAreaInsetsContext.Consumer>
          {insets => (
            <ScrollView style={{paddingTop: insets.top}}>
              <LoginOptionsMenu
                onLogin={this.onLogin}
                onLogout={this.onLogout}
              />
              <ContenedorMenu>
                {tags.map(tag => this.mostrarTags(tag))}
              </ContenedorMenu>
            </ScrollView>
          )}
        </SafeAreaInsetsContext.Consumer>
      </>
    );
  };
}
