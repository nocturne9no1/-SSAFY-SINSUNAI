import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Dimensions, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input, TextArea, Button } from "../components";
import { AntDesign } from "@expo/vector-icons";
import AnalysisResult from "../components/GroupBuy/AnalysisResult";
import { getData } from "../utils/asyncstorage";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import axios from "axios";

const screenHeight = Dimensions.get("window")["height"];
const screenWidth = Dimensions.get("window")["width"];
const standard = screenHeight > screenWidth ? screenWidth : screenHeight;

const Container = styled.ScrollView`
  margin-top: ${screenHeight * 0.05}px;
  padding: 0px 20px;
`;

const ToggleContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ToggleText = styled.Text`
  font-size: ${standard * 0.04}px;
  margin-right: 5px;
`;

const CameraContainer = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PhotoText = styled.Text`
  font-size: ${screenWidth * 0.05}px;
`;

const InfoContainer = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px 0px;
`;
const SingleInfoContainer = styled.View`
  width: 30%;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const InfoInput = styled.TextInput`
  background-color: wheat;
  padding: 20px 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border: 1px solid black;
  border-radius: 4px;
`;

export default GroupBuyCreate = ({ navigation, route }) => {
  const contentRef = useRef();
  const locationRef = useRef();
  const kindRef = useRef();
  const priceRef = useRef();
  const personnelRef = useRef();
  const [disabled, setDisabled] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [kind, setKind] = useState("");
  const [price, setPrice] = useState(0);
  const [personnel, setPersonnel] = useState(0);
  const [date, setDate] = useState(moment().toDate());
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const photo = !!route.params
    ? !!route.params.photo
      ? route.params.photo
      : null
    : null;

  const market = !!route.params
    ? !!route.params.market
      ? route.params.market
      : null
    : null;

  const toggleSwitch = () => {
    setIsSeller((preState) => !preState);
  };

  const onCreateBtnClick = async () => {
    const token = await getData("token");
    console.log("token;", token);
    console.log(
      title,
      kind,
      parseInt(personnel),
      moment(date).format("YYYY-MM-DDThh:mm"),
      content,
      market.id,
      photo
    );
    axios({
      method: "post",
      url: "/articles/",
      data: {
        title: title,
        article_kind: kind,
        personnel: parseInt(personnel),
        meeting_time: moment(date).format("YYYY-MM-DDThh:mm"),
        body: content,
        market_id: market.id,
        article_picture: photo,
      },
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        console.log("article create response;", res.data);
        navigation.navigate("GroupBuy");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setDisabled(
      isSeller
        ? !(
            !!photo &&
            !!title &&
            !!content &&
            !!market &&
            !!kind &&
            !!price &&
            !!personnel
          )
        : !(
            !!title &&
            !!content &&
            !!market &&
            !!kind &&
            !!price &&
            !!personnel
          )
    );
  }, [title, content, market, kind, price, isSeller, personnel]);
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <Container>
        <ToggleContainer>
          {isSeller ? (
            <ToggleText style={{ color: "#febb25" }}>??????????????????</ToggleText>
          ) : (
            <ToggleText>??????????????????</ToggleText>
          )}

          <Switch
            trackColor={{ false: "#febb25", true: "#febb25" }}
            value={isSeller}
            onValueChange={toggleSwitch}
          />
        </ToggleContainer>
        {isSeller &&
          (!!photo ? (
            <CameraContainer
              onPress={() =>
                navigation.navigate("Camera", { from: "GroupBuyCreate" })
              }
            >
              <AnalysisResult photo={photo} />
            </CameraContainer>
          ) : (
            <CameraContainer
              onPress={() =>
                navigation.navigate("Camera", { from: "GroupBuyCreate" })
              }
            >
              <AntDesign name="camera" size={50} color="black" />
              <PhotoText>????????? ????????? ???????????????</PhotoText>
            </CameraContainer>
          ))}
        <Input
          placeholder="??????"
          label="??????"
          returnKeyType="next"
          onSubmitEditing={() => contentRef.current.focus()}
          onChangeText={setTitle}
        />
        <TextArea
          placeholder="??????"
          label="??????"
          returnKeyType="next"
          ref={contentRef}
          onSubmitEditing={() => locationRef.current.focus()}
          onChangeText={setContent}
        />
        <InfoContainer>
          <SingleInfoContainer>
            <InfoLabel>??????</InfoLabel>
            <InfoInput
              placeholder="??????"
              value={!!market ? market.name : null}
              returnKeyType="next"
              ref={locationRef}
              onSubmitEditing={() => kindRef.current.focus()}
              onFocus={() => navigation.navigate("MapScreenGroup", { photo })}
            />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <InfoLabel>??????</InfoLabel>
            <InfoInput
              ref={kindRef}
              placeholder="??????"
              onSubmitEditing={() => priceRef.current.focus()}
              onChangeText={setKind}
            />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <InfoLabel>??????</InfoLabel>
            <InfoInput
              ref={priceRef}
              placeholder="??????"
              onSubmitEditing={() => personnelRef.current.focus()}
              onChangeText={setPrice}
            />
          </SingleInfoContainer>
        </InfoContainer>
        <InfoContainer>
          <SingleInfoContainer>
            <InfoLabel>?????? ???</InfoLabel>
            <InfoInput
              ref={personnelRef}
              placeholder="?????? ???"
              onChangeText={setPersonnel}
            />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <InfoLabel>??????</InfoLabel>
            <DateTimePicker
              locale={"ko"}
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          </SingleInfoContainer>
          <SingleInfoContainer>
            <InfoLabel>??????</InfoLabel>
            <DateTimePicker
              locale={"ko"}
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          </SingleInfoContainer>
        </InfoContainer>
        <Button disabled={disabled} title="??????" onPress={onCreateBtnClick} />
      </Container>
    </KeyboardAwareScrollView>
  );
};
