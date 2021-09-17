import React, {ChangeEvent, useState} from 'react';
import {Input, Modal} from "antd";

interface IProps {
    isModalVisible: boolean,
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    addFunctionWrapper: (title: string) => void,
    title: string
}

const AddNewItemFormModal: React.FC<IProps> = ({isModalVisible, setIsModalVisible, addFunctionWrapper, title}) => {

    const [inpText, setInpText] = useState<string>('')

    const handleOk = () => {
        setIsModalVisible(false)
        addFunctionWrapper(inpText)
        setInpText('')
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setInpText('')
    }

    const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInpText(e.currentTarget.value)
    }

    return (
        <Modal okButtonProps={{disabled: !inpText}} title={title} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input.TextArea value={inpText} onChange={onChangeHandler} autoFocus={true}/>
        </Modal>
    );
};

export default AddNewItemFormModal;