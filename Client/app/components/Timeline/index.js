import React, { PropTypes } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    ListView,
    RefreshControl,
    Platform,
    Alert,
} from 'react-native';
import _ from 'lodash';
import PopupDialog, { ScaleAnimation } from 'react-native-popup-dialog';

import DropdownAlert from '../../components/DropdownAlert';
import global from '../../config/global';
import socket from '../../config/socket.io';
import styles from './style';
import TimelineListItem from '../../components/TimelineListItem';

const contents = ['커피', '밥버거', '토스트', '데려다줘', '인쇄', '책반납', '기타'];
const STORAGE_KEY = '@PRETZEL:jwt';
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class TimeLine extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['helpme', 'helpyou', 'together']).isRequired,
        onNavigate: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const arr = [];
        contents.forEach(() => {
            arr.push(false);
        });

        // this.socket = socket.connectSocket();
        // this.socket.on('message', this.onChatRecieve);

        this.state = {
            otherEnabled: arr,
            dataSource: ds.cloneWithRows([]),
            refreshing: false,
            selectedRow: {},
        };

        this.GetToken = this.GetToken.bind(this);
        this.HttpRequest = this.HttpRequest.bind(this);
        this.RenderRefresh = this.RenderRefresh.bind(this);
        this.ShowModal = this.ShowModal.bind(this);
        // this.onChatRecieve = this.onChatRecieve.bind(this);
    }

    componentDidMount() {
        this.RenderRefresh();
    }
    GetToken() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(STORAGE_KEY, (err, value) => {
                if (err) reject(err);
                else resolve(value);
            });
        });
    }
    filterManager() {
        const arr = [];

        this.state.otherEnabled.forEach((value, index) => {
            if (value) {
                arr.push(contents[index]);
            }
        });
        return arr;
    }
    HttpRequest(token) {
        /* global fetch */
        return fetch('http://13.124.147.152:8124/api/timeline?type=' + this.props.type, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': token,
            },
        }).then(res => res.json());
    }

    RenderRefresh() {
        this.setState({ dataSource: ds.cloneWithRows([]) }, () => {
            this.GetToken()
                .then(this.HttpRequest)
                .then((res) => {
                    if (res.resultCode !== 100) {
                        this.dropdown.alertWithType('error', '서버 에러', res.result);
                    } else if (_.find(this.state.otherEnabled, o => o)) {
                        this.setState({ dataSource: this.state.dataSource.cloneWithRows(_.filter(res.result, (o) => {
                            const arr = this.filterManager();
                            let founded = false;
                            arr.forEach((element) => {
                                if (_.includes(o.content, element)) {
                                    founded = true;
                                }
                            });
                            return founded;
                        })) });
                    } else {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(res.result),
                        });
                    }
                },
                );
        });
    }
    ShowModal() {
        this.modal.show();
    }

    render() {
        const ListViewMarginTop = Platform.OS === 'ios' ? { marginTop: 20 } : { marginTop: 0 };
        return (
            <View style={styles.container}>
                <View style={styles.filter}>
                    <View style={styles.filter_head}>
                        <Text style={{ fontSize: 12 }}>필터</Text>
                    </View>
                    <View style={styles.filter_content}>
                        <ScrollView horizontal={true} style={styles.filter_scrollview}>
                            <TouchableOpacity
                                style={
                                    _.find(this.state.otherEnabled, (o) => { return o; }) ? styles.filter_item_disabled : styles.filter_item_enabled

                                }
                                onPress={() => {
                                    const arr = [];
                                    contents.forEach(() => {
                                        arr.push(false);
                                    });
                                    this.setState({ otherEnabled: arr }, () => {
                                        this.RenderRefresh();
                                    });
                                }}>

                                <Text style={
                                    _.find(this.state.otherEnabled, (o) => { return o; }) ? styles.filter_text_disabled : styles.filter_text_enabled
                                }>모두보기</Text>
                            </TouchableOpacity>
                            {contents.map((value, i) => (
                                <TouchableOpacity
                                    style={
                                        this.state.otherEnabled[i] ? styles.filter_item_enabled : styles.filter_item_disabled
                                    }
                                    key={value}
                                    onPress={() => {
                                        const prevState = this.state.otherEnabled;
                                        prevState[i] = !prevState[i];
                                        this.setState({ otherEnabled: prevState }, () => {
                                            this.RenderRefresh();
                                        });
                                    }}>
                                    <Text style={
                                        this.state.otherEnabled[i] ? styles.filter_text_enabled : styles.filter_text_disabled
                                    }
                                    >{value}</Text>
                                </TouchableOpacity>
                            ))}

                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.timeline_container, ListViewMarginTop]}>

                    <ListView
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.RenderRefresh}
                            />
                        }
                        contentContainerStyle={{ paddingBottom: 200 }}
                        automaticallyAdjustContentInsets={false}
                        removeClippedSubviews={false}
                        renderRow={(rowData, sectionID, rowID, highlightRow) =>
                            (this.state.dataSource.length === 0 ?
                                <View><Text>Empty..</Text></View>
                                :
                                <View>
                                    <TimelineListItem
                                        user_email={rowData.user_email}
                                        detailInfo={rowData.detailInfo}
                                        expectedPrice={rowData.expectedPrice}
                                        fee={rowData.fee}
                                        deadline={rowData.deadline}
                                        rid={rowData.rid}
                                        title={rowData.title}
                                        time={rowData.time}
                                        place={rowData.place}
                                        onPress={() => {
                                            this.setState({ selectedRow: rowData }, () => {
                                                this.ShowModal();
                                            });
                                        }}
                                        onNavigate={this.props.onNavigate}
                                    />
                                </View>
                            )
                        }
                    />
                </View>
                <PopupDialog
                    ref={(ref) => this.modal = ref}
                    dialogAnimation={new ScaleAnimation()}
                    dialogTitle={(<View />)}
                    // dialogTitle={<DialogTitle title="상세 정보" titleTextStyle={{color: '#f95a25'}}/>}
                    dialogStyle={styles.dialog_container}
                >
                    <View style={styles.dialog}>
                        <View style={styles.popCell}>
                            <View style={styles.popCellOne}>
                                <View style={styles.popCellOneRow}>
                                    <View style={styles.popCellOneLine}>
                                    </View>
                                    <View style={styles.popCellOneDate}>
                                        <Text style={{fontSize:10}}>{this.state.selectedRow.time ? global.DateToStr(this.state.selectedRow.time) : undefined}</Text>
                                    </View>
                                </View>
                                <View style={styles.popCellOneRow}>
                                    <View style={styles.popCellOneInfo}>
                                        <Text style={{color : '#D2DB08', fontWeight:'bold', fontSize:30}}># </Text>
                                        <Text style={{fontSize:20}}>{this.state.selectedRow.content}</Text>
                                    </View>
                                    <View style={styles.popCellOneInfo}>
                                        <Text style={{color : '#D2DB08', fontWeight:'bold', fontSize:30}}># </Text>
                                        <Text style={{fontSize:20}}>{this.state.selectedRow.contentType}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.popCellTwo}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popCellTwoTitle}>{this.state.selectedRow.title}</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text>{this.state.selectedRow.detailInfo}</Text>
                                </View>
                            </View>
                            <View style={styles.popCellThree}>
                                <View style={styles.popCellThreeInfo}>
                                    <View style={styles.popCellThreeRow}>
                                        <Text style={{fontWeight:'bold',}}>배달장소 │ </Text>
                                    </View>
                                    <View style={styles.popCellThreeColumn}>
                                        <Text style={styles.popCellText}>{this.state.selectedRow.place}</Text>
                                    </View>
                                </View>
                                <View style={styles.popCellThreeInfo}>
                                    <View style={styles.popCellThreeRow}>
                                        <Text style={{fontWeight:'bold',}}>배달기한 │ </Text>
                                    </View>
                                    <View style={styles.popCellThreeColumn}>
                                        <Text style={styles.popCellText}>{this.state.selectedRow.deadline ? global.DateToStr2(this.state.selectedRow.deadline) : undefined}</Text>
                                    </View>
                                </View>
                                <View style={styles.popCellThreeInfo}>
                                    <View style={styles.popCellThreeRow}>
                                        <Text style={{fontWeight:'bold',}}>예상가격 │ </Text>
                                    </View>
                                    <View style={styles.popCellThreeColumn}>
                                        <Text style={styles.popCellText}>{this.state.selectedRow.expectedPrice}</Text>
                                    </View>
                                </View>
                                <View style={styles.popCellThreeInfo}>
                                    <View style={styles.popCellThreeRow}>
                                        <Text style={{fontWeight:'bold',}}>배달료  │ </Text>
                                    </View>
                                    <View style={styles.popCellThreeColumn}>
                                        <Text style={styles.popCellText}>{this.state.selectedRow.fee}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.popCellFour}>
                            </View>
                        </View>
                    </View>
                </PopupDialog>
                <DropdownAlert
                    ref={(ref) => this.dropdown = ref}
                    onCancel={() => this.setState({ elevationToZero: false })}
                    onClose={() => this.setState({ elevationToZero: false })}
                />
            </View>
        );
    }
}
