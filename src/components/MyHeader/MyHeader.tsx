import React from 'react';
import {Layout, Menu} from "antd";
import {useTypedSelector} from "../../utils/hooks";
import {IFilter, todoActions} from "../../store/todoReducer";
import {MenuInfo} from "rc-menu/lib/interface";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {getFilters} from "../../utils/selectors";

const {Header} = Layout

const MyHeader = () => {

    const filters = useTypedSelector(getFilters)
    const key = Object.keys(filters).find((key: string)  => filters[key as keyof IFilter])
    const dispatch = useDispatch<AppDispatch>()

    const selectHandler = (e: MenuInfo) => {
        dispatch(todoActions.changeFilter({filter: e.key}))
    }

    return (
        <Header style={{ padding: 0}}>
            <Menu selectedKeys={key ? [key] : []} mode="horizontal" onClick={selectHandler}>
                {
                    Object.keys(filters).map((key: string) => <Menu.Item key={key}>{key}</Menu.Item>)
                }
            </Menu>
        </Header>
    );
};

export default MyHeader;