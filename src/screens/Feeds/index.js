import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {Header} from 'react-native-elements';

import DrawerLayout from 'react-native-drawer-layout';

import FeedCard from '../../components/FeedCard';
import noticiasEstaticas from '../../assets/dicionarios/noticias.js';
import {
  EntradaNomeTitulo,
  CentralizadoNaMesmaLinha,
  Cabecalho,
  IconNavbar,
} from '../../assets/styles';
import Menu from '../../components/Menu';

const FEEDS_POR_PAGINA = 2;

export default class Feeds extends Component {
  constructor(props) {
    super(props);
    this.filtrarPorTag = this.filtrarPorTag.bind(this);

    this.state = {
      proximaPagina: 0,
      feeds: [],

      tagEscolhida: null,
      tagSearch: null,
      atualizando: false,
      carregando: false,
    };
  }

  // carregar o total de feeds por pagina na pagina atual
  carregarFeeds = () => {
    const {proximaPagina, feeds, tagSearch, tagEscolhida} = this.state;

    // avisa que esta carregando
    this.setState({
      carregando: true,
    });

    //filtragem pela tag
    if (tagEscolhida) {
      const maisFeeds = noticiasEstaticas.news.filter(feed =>
        feed.tags.includes(tagEscolhida.tag),
      );

      this.setState({
        feeds: maisFeeds,

        atualizando: false,
        carregando: false,
      });
    } else if (tagSearch) {
      // precisa filtar pela tag de busca
      const maisFeeds = noticiasEstaticas.news.filter(feed => {
        const search = tagSearch.toLowerCase();

        return (
          feed.tags.some(t => t.includes(search)) || feed.title.includes(search)
        );
      });

      this.setState({
        feeds: maisFeeds,

        atualizando: false,
        carregando: false,
      });
    } else {
      // carregar o total de feeds por pagina da pagina atual
      const idInicial = proximaPagina * FEEDS_POR_PAGINA + 1;
      const idFinal = idInicial + FEEDS_POR_PAGINA - 1;
      const maisFeeds = noticiasEstaticas.news.filter(
        feed => feed._id >= idInicial && feed._id <= idFinal,
      );

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
    }
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
        proximaPagina: 0,
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
            this.carregarFeeds();
          }}
        />
      </CentralizadoNaMesmaLinha>
    );
  };

  mostrarMenu = () => {
    this.menu.openDrawer();
  };

  filtrarPorTag = tag => {
    this.setState({tagEscolhida: tag}, () => {
      this.carregarFeeds();
    });

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

  render = () => {
    const {feeds} = this.state;
    if (feeds.length) {
      console.log('exibindo' + feeds.length + ' feeds');

      return this.mostrarFeeds(feeds);
    } else {
      return null;
    }
  };
}
