import React from 'react';
import { render } from '@testing-library/react';
import IconText from './IconText';

describe('<IconText />', () => {
    it('matches snapshot', () => {
        const utils = render(<IconText type="search" text="unit test" />);
        expect(utils.container).toMatchSnapshot();
    });

    it('text 프로퍼티가 정상적으로 출력되는가', () => {
        const utils = render(<IconText type="search" text="unit test" />);
        utils.getAllByText('unit test');
    });
});
