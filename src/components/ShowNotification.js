import { notification } from 'antd';

export const ShowNotification = ({ title, message, onClick, icon }) => {
    notification.open({
        message: title,
        description: message,
        onClick: onClick,
        icon: !!icon && icon,
    });
};
