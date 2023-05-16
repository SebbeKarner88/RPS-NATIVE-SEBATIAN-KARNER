import React, {useEffect, useState} from 'react';
import {View, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import Header from "../components/Header";
import GameButton from "../components/GameButton";
import TitleBox from "../components/TitleBox";
import {getData, storeData} from "./HomeScreen";
import GameBox from "../components/GameBox";
import RefreshButton from "../components/RefreshButton";

const JoinGameFetch = async (gameId) => {
    try {
        return fetch("http://213.100.195.78:8080/games/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: await getData('token'),
                gameId: gameId,
            },
        })
            .then((response) => response.json())
    }catch (e) {
        console.log(e.message)
    }
}

const CreateGameFetch = async () => {
    try {
        return fetch("http://213.100.195.78:8080/games/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: await getData('token'),
            },
        })
            .then((response) => response.json())
    }catch (e) {
    }
}

const OpenGamesFetch = async () => {
    try {
        return fetch("http://213.100.195.78:8080/games", {
            method: "GET",
        })
            .then((response) => response.json())
    }catch (e) {
    }
}

const GameScreen = ({navigation}) => {

    const [refreshGames, setRefreshGames] = useState(false);
    const [openGames, setOpenGames] = useState([]);

    const handleStartGame = async () => {
        await CreateGameFetch()
            .then( (res) => {
                storeData('gameId', res.gameStatusId);
                navigation.navigate('GameBoard');
            })
    };

    const handleJoin = async (gameId) => {
        await JoinGameFetch(gameId)
            .then(() => {
                storeData('gameId',gameId);
                navigation.navigate('GameBoard');
            });
    };

    useEffect(() => {
         OpenGamesFetch()
            .then((game) => {
                setOpenGames(game);
            })
            .catch((err) => console.log(err.message))
    }, [refreshGames]);


    return (
        <ImageBackground
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
            }}
            source={require('../../assets/background-grey.jpg')}>
            <View>

                <Header navigation={navigation}/>

                <TitleBox title={'Create Game'}/>

                <View style={styles.gameTypeBox}>
                    <TouchableOpacity disabled>
                        <GameButton title={'1 P'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStartGame()}>
                        <GameButton title={'2 P'}/>
                    </TouchableOpacity>
                </View>

                <TitleBox title={'Join Game'}/>
                <TouchableOpacity onPress={() => setRefreshGames(!refreshGames)}>
                    <RefreshButton title={'Refresh'}/>
                </TouchableOpacity>

                <View style={{height: 300}}>

                    <FlatList
                        data={openGames}
                        keyExtractor={item => item.gameStatusId}
                        renderItem={({item}) =>
                            <GameBox opponent={item.playerOne.username} joinGame={() => handleJoin(item.gameStatusId)}/>
                    }/>
                </View>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    gameTypeBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})


export default GameScreen;

