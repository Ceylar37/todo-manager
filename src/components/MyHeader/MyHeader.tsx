import React, {ChangeEvent} from 'react'
import {Col, Input, Layout, Menu, Row} from "antd"
import {useTypedSelector} from "../../utils/hooks"
import {IFilter, todoActions} from "../../store/todoReducer"
import {MenuInfo} from "rc-menu/lib/interface"
import {useDispatch} from "react-redux"
import {AppDispatch} from "../../store"
import {getCurrentFilter, getFilters, getFilterTerm} from "../../utils/selectors"
import './../../App.scss'

const {Header} = Layout

const MyHeader = () => {

    const filters = useTypedSelector(getFilters)
    const currentFilter = useTypedSelector(getCurrentFilter)
    const filterTerm = useTypedSelector(getFilterTerm)
    const dispatch = useDispatch<AppDispatch>()
    const selectHandler = (e: MenuInfo) => {
        dispatch(todoActions.changeFilter({filterName: e.key}))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(todoActions.changeFilterTerm({newFilterTerm: e.currentTarget.value}))
    }
    return (
        <Header style={{padding: 0, backgroundColor: "white"}}>
            <Row justify={'space-around'} align={'middle'}>
                <Col>
                    <Menu selectedKeys={currentFilter ? [currentFilter] : []} mode="horizontal" onClick={selectHandler}>
                        {
                            filters.map(filter => <Menu.Item id={'modified-item'}
                                                             key={filter.name}>{filter.name}</Menu.Item>)
                        }
                    </Menu>
                </Col>
                <Col>
                    <Input style={{display: "flex"}} onChange={onChangeHandler} value={filterTerm}/>
                </Col>
            </Row>
        </Header>
    )
}

export default MyHeader