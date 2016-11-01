/**
 * Created by mahaiping on 2016/10/31.
 */
/**
 * Created by Jason on 16/9/7.
 */
//discription:
//picCount :显示图片数量限制  required
//uriArray :传入的已知图片地址数组 optional 不传的话默认显示一个加号
//withoutDelete :传入的布尔类型，代表是否显示删除的按钮 required

import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    InteractionManager,
    Alert,
} from 'react-native';

import ImagePickerManager from 'react-native-image-picker';

// import ViewPicture from '../../pages/ViewPicture';

var {height, width} = Dimensions.get('window');
var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});



export default class gridView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            avatarSource: null,
            imageArray:[],
            dataSource:dataSource.cloneWithRows([require('./addPic.png')]),
        };
    }
    componentDidMount() {
        if (this.props.uriArray && this.props.uriArray.length > 0) {
            Alert.alert(
                'Alert Title',
                'alertMessage',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                    {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
            )
            if (this.props.uriArray && this.props.uriArray.length < this.props.picCount + 1) {
                this.props.uriArray.push(require('./addPic.png'));
            }
            this.state.imageArray = this.props.uriArray;
            this.setState({
                dataSource: dataSource.cloneWithRows(this.props.uriArray),
            });
        }

    }
    _pressRow(rowData,sectionID,rowID){
        console.log(rowData)
        console.log(sectionID)
        console.log(rowID)
        console.log(this.state.imageArray)
        //alert('hhhhhhhh')
        // this._pressViewPicture(rowData);
        if (rowID >= this.state.imageArray.length -1){
            this._buttonAction()
        }
    }

    // _pressViewPicture = (uri) =>{
    //     const {navigator} = this.props;
    //     InteractionManager.runAfterInteractions(() =>{
    //         if (navigator) {
    //             navigator.push({
    //                 name: 'ViewPicture',
    //                 component: ViewPicture,
    //                 passProps: {
    //                     uri:uri,
    //                 },
    //             })
    //         }
    //     });
    // }

    _pressDelete(rowData,sectionID,rowID){
        console.log('哈哈哈哈哈哈哈哈哈')
        console.log(rowData)
        console.log(sectionID)
        console.log(rowID)
        if (rowID == this.state.imageArray.length - 1 && this.state.imageArray.length != this.props.picCount + 1){
            return;
        }
        this.state.imageArray.splice(rowID,1,);
        console.log('啦啦啦啦啦啦啦' + rowID),
            console.log(this.state.imageArray.length);
        this.setState({
            dataSource :dataSource.cloneWithRows(this.state.imageArray),
        });
    }
    _buttonAction = ()=>{
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'相机',
            chooseFromLibraryButtonTitle:'相册',
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePickerManager.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data...
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    const source = {uri: response.uri, isStatic: true};
                }
                this.state.imageArray.pop();
                this.state.imageArray.push(source,require('./addPic.png'));

                this.setState({
                    avatarSource: source,
                    dataSource :dataSource.cloneWithRows(this.state.imageArray),
                });

            }
        });
    }
    _renderRow(rowData,sectionID,rowID,){
        if (rowID < this.props.picCount && this.props.withoutDelete == false)
            return (
                <View style={styles.rowView}>
                    <TouchableOpacity onPress={() => {this._pressRow(rowData,sectionID,rowID)}} >
                        <Image source={rowData} style={styles.rowImage}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteStyle} onPress={() => this._pressDelete(rowData,sectionID,rowID)}>
                        <Image source={require('./delete.png') } style={[styles.deleteImage , {opacity:(rowID >= this.state.imageArray.length-1? 0:1 )}]}/>
                    </TouchableOpacity>
                </View>
            );
        else if (rowID < this.props.picCount && this.props.withoutDelete == true){
            return (
                <View style={styles.rowView}>
                    <TouchableOpacity onPress={() => {this._pressRow(rowData,sectionID,rowID)}} >
                        <Image source={rowData} style={styles.rowImage}/>
                    </TouchableOpacity>
                </View>
            )
        }else
            return(
                <View></View>
            );
    }
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    contentContainerStyle={styles.ListView}
                    dataSource = {this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor:'red',
        width:width,
    },
    ListView:{
        justifyContent: 'flex-start',
        // justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft:15,
        marginBottom:15,
    },
    rowView:{
        height:(width-60)/3,
        width:(width-60)/3,
        // backgroundColor:'yellow',
        marginRight:15,
        marginTop:15,
        flexDirection:'row',
    },
    rowImage:{
        height:(width-60)/3,
        width:(width-60)/3,
    },
    deleteStyle:{
        width:25,
        height:25,
        marginTop:-12.5,
        // backgroundColor:'blue',
        marginLeft: -12.5,
        borderRadius:12.5,
    },
    deleteImage:{
        flex:1,
        height:27,
        width:27,
    },
});