import React, {useState} from 'react'
import {Button, Col, Divider, Layout, List, Row} from "antd"
import {useTypedSelector} from "../../utils/hooks"
import {getCurrentTodoList} from "../../utils/selectors"
import AddNewItemFormModal from "../common/AddNewItemFormModal/AddNewItemFormModal";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {deleteTodoList, todoActions} from "../../store/todoReducer";

const {Content} = Layout

const MyContent = () => {

    const currentTodoList = useTypedSelector(getCurrentTodoList)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const onClickHandler = () => {
        setIsModalVisible(true)
    }

    const boundedAddTodo = (text: string) => {
        dispatch(todoActions.addTodoToList({todoTitle: text}))
    }

    return (
        <Content style={{margin: '24px 16px 0'}}>
            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                <Divider orientation="left">
                    <strong>
                        {currentTodoList?.name}
                    </strong>
                    <Button type="link" danger onClick={() => {
                        dispatch(deleteTodoList())
                    }}>
                        Delete this
                    </Button>
                </Divider>
                <List
                    size="large"
                    footer={<Button style={{padding: 0}} type={'link'} onClick={onClickHandler}>Add new todo</Button>}
                    bordered
                    dataSource={currentTodoList?.value}
                    renderItem={item =>
                        <List.Item key={item.id}>
                            <Todo id={item.id} completed={item.completed} title={item.title}/>
                        </List.Item>}
                />
            </div>
            <AddNewItemFormModal title={'Add new todo'} isModalVisible={isModalVisible}
                                 setIsModalVisible={setIsModalVisible} addFunctionWrapper={boundedAddTodo}/>
        </Content>
    )
}

interface IProps {
    title: string
    completed: boolean
    id: string
}

const Todo: React.FC<IProps> = ({title, completed, id}) => {

    const dispatch = useDispatch<AppDispatch>()

    return (
        <Row style={{width: '100%'}} justify={'space-between'}>
            <Col style={{textDecoration: completed ? 'line-through' : 'none'}} span={''}>
                {title}
            </Col>
            <Col style={{color: "red", cursor: "pointer"}} onClick={() => {
                dispatch(todoActions.deleteTodo({todoId: id}))
            }}>
                x
            </Col>
        </Row>
    )
}

export default MyContent