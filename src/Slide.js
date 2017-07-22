import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash.omit'
import cx from 'classnames'

export default function Slide ({ children, className, ...rest }) {
  return (
    <div className={cx('swiper-slide', className)} {...omit(rest, 'onActive')}>
      {children}
    </div>
  )
}

Slide.propTypes = {
  onActive: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string
}
