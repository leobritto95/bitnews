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
import Icon from 'react-native-vector-icons/AntDesign';
import {getMenuTags, menuTagsAlive} from '../../api';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      atualizar: true,
      filtrar: props.filtragem,

      tags: [],
    };
  }

  componentDidMount = () => {
    menuTagsAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          getMenuTags()
            .then(tags => {
              this.setState({
                tags,
              });
            })
            .catch(error => {
              console.log('ocorreu um erro criando menu de empresas' + error);
            });
        } else {
          Toast.show(
            'Não é possível carregar as o menu de busca por tags agora :(',
            Toast.LONG,
          );
        }
      })
      .catch(error => {
        console.error('erro verificando disponibilidade de servico: ' + error);
      });
  };

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
    const {tags} = this.state;

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
