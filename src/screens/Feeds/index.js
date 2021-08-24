import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {Header, Button} from 'react-native-elements';

import DrawerLayout from 'react-native-drawer-layout';
import Icon from 'react-native-vector-icons/AntDesign';

import FeedCard from '../../components/FeedCard';
import {
  EntradaNomeTitulo,
  CentralizadoNaMesmaLinha,
  Cabecalho,
  ContenedorMensagem,
  Mensagem,
  IconNavbar,
  Espacador,
} from '../../assets/styles';
import Menu from '../../components/Menu';
import {getFeeds, getFeedsPorBusca, getFeedsPorTag, feedAlive} from '../../api';

export default class Feeds extends Component {
  constructor(props) {
    super(props);
    this.filtrarPorTag = this.filtrarPorTag.bind(this);

    this.state = {
      proximaPagina: 1,
      feeds: [],

      tagEscolhida: null,
      tagSearch: null,
      podeVerFeeds: true,
      atualizando: false,
      carregando: false,
    };
  }

  mostrarMaisFeeds = maisFeeds => {
    const {proximaPagina, feeds} = this.state;
    if (maisFeeds.length) {
      console.log('adicionando ' + maisFeeds.length + ' feeds');
      // incrementar a pagina e guardas os feeds
      this.setState({
        proximaPagina: proximaPagina + 1,
        feeds: [...feeds, ...maisFeeds],

        atualizando: false,
        carregando: false,
      });
    } else {
      this.setState({
        atualizando: false,
        carregando: false,
      });
    }
  };

  // carregar o total de feeds por pagina na pagina atual
  carregarFeeds = () => {
    const {proximaPagina, tagSearch, tagEscolhida} = this.state;

    // avisa que esta carregando
    this.setState({
      carregando: true,
    });

    feedAlive()
      .then(resultado => {
        if (resultado.alive === 'yes') {
          this.setState({podeVerFeeds: true}, () => {
            //filtragem pela tag
            if (tagEscolhida) {
              getFeedsPorTag(tagEscolhida.tag, proximaPagina)
                .then(maisFeeds => {
                  this.mostrarMaisFeeds(maisFeeds);
                })
                .catch(error => {
                  console.error('erro acessando feeds: ' + error);
                });
            } else if (tagSearch) {
              getFeedsPorBusca(tagSearch, proximaPagina)
                .then(maisFeeds => {
                  this.mostrarMaisFeeds(maisFeeds);
                })
                .catch(error => {
                  console.error('erro acessando feeds: ' + error);
                });
            } else {
              getFeeds(proximaPagina)
                .then(maisFeeds => {
                  this.mostrarMaisFeeds(maisFeeds);
                })
                .catch(error => {
                  console.error('erro acessando feeds: ' + error);
                });
            }
          });
        } else {
          this.setState({podeVerFeeds: false});
        }
      })
      .catch(error => {
        console.log('erro verificando a disponibilidade do servico: ' + error);
      });
  };

  componentDidMount = () => {
    this.carregarMaisFeeds();
  };

  carregarMaisFeeds = () => {
    const {carregando} = this.state;

    if (carregando) {
      return;
    }

    this.carregarFeeds();
  };

  atualizar = () => {
    this.setState(
      {
        atualizando: true,
        feeds: [],
        proximaPagina: 1,
        tagSearch: null,
        tagEscolhida: null,
      },
      () => {
        this.carregarFeeds();
      },
    );
  };

  mostrarFeed = feed => {
    return <FeedCard feed={feed} navegador={this.props.navigation} />;
  };

  atualizarTag = tag => {
    this.setState({tagSearch: tag});
  };

  mostrarBarraPesquisa = () => {
    const {tagSearch} = this.state;
    return (
      <CentralizadoNaMesmaLinha>
        <EntradaNomeTitulo
          onChangeText={tag => {
            this.atualizarTag(tag);
          }}
          value={tagSearch}
        />
        <IconNavbar
          style={{padding: 8}}
          size={20}
          name="search1"
          onPress={() => {
            this.setState({proximaPagina: 1, feeds: []}, () => {
              this.carregarFeeds();
            });
          }}
        />
      </CentralizadoNaMesmaLinha>
    );
  };

  mostrarMenu = () => {
    this.menu.openDrawer();
  };

  filtrarPorTag = tag => {
    this.setState(
      {
        tagEscolhida: tag,
        proximaPagina: 1,
        feeds: [],
      },
      () => {
        this.carregarFeeds();
      },
    );

    this.menu.closeDrawer();
  };

  mostrarFeeds = feeds => {
    const {atualizando} = this.state;
    return (
      <DrawerLayout
        drawerWidth={250}
        drawerPosition={DrawerLayout.positions.Left}
        ref={drawerElement => {
          this.menu = drawerElement;
        }}
        renderNavigationView={() => <Menu filtragem={this.filtrarPorTag} />}>
        <Header
          leftComponent={
            <IconNavbar
              size={28}
              name="menuunfold"
              onPress={() => {
                this.mostrarMenu();
              }}
            />
          }
          centerComponent={this.mostrarBarraPesquisa()}
          containerStyle={Cabecalho}
        />
        <FlatList
          data={feeds}
          numColumns={1}
          onEndReached={() => this.carregarMaisFeeds()}
          onEndReachedThreshold={0.1}
          onRefresh={() => this.atualizar()}
          refreshing={atualizando}
          keyExtractor={item => String(item._id)}
          renderItem={({item}) => {
            return <View>{this.mostrarFeed(item)}</View>;
          }}
          style={{backgroundColor: '#9a8c98'}}
        />
      </DrawerLayout>
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
            this.carregarFeeds();
          }}
        />
      </ContenedorMensagem>
    );
  };

  mostrarMensagemCarregando = () => {
    return (
      <ContenedorMensagem>
        <Mensagem>Carregando feeds. Aguarde...</Mensagem>
      </ContenedorMensagem>
    );
  };

  render = () => {
    const {feeds, podeVerFeeds} = this.state;

    if (podeVerFeeds) {
      if (feeds) {
        console.log('exibindo' + feeds.length + ' feeds');

        return this.mostrarFeeds(feeds);
      } else {
        return this.mostrarMensagemCarregando();
      }
    } else {
      return this.mostrarBotaoAtualizar();
    }
  };
}
