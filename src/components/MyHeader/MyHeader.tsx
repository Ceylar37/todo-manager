import React from 'react'
import {Layout, Menu} from "antd"
import {useTypedSelector} from "../../utils/hooks"
import {IFilter, todoActions} from "../../store/todoReducer"
import {MenuInfo} from "rc-menu/lib/interface"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../store"
import {getCurrentFilter, getFilters} from "../../utils/selectors"
import './../../App.scss'

const {Header} = Layout

const MyHeader = () => {

    const filters = useTypedSelector(getFilters)
    const currentFilter = useTypedSelector(getCurrentFilter)
    const dispatch = useDispatch<AppDispatch>()
    const selectHandler = (e: MenuInfo) => {
        dispatch(todoActions.changeFilter({filterName: e.key}))
    }

    return (
        <Header style={{ padding: 0}}>
            <Menu selectedKeys={currentFilter ? [currentFilter] : []} mode="horizontal" onClick={selectHandler}>
                {
                    filters.map(filter => <Menu.Item id={'modified-item'} key={filter.name}>{filter.name}</Menu.Item>)
                }
            </Menu>
        </Header>
    )
}

export default MyHeader