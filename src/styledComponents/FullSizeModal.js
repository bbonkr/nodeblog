import styled from 'styled-components';
import { Modal } from 'antd';

const FullSizeModal = styled(Modal)`
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    min-height: 100vh;
    overflow-y: auto;
`;

export default FullSizeModal;
