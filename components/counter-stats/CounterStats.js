import React from 'react'
import CounterUp from '../elements/CounterUp'

function CounterStats() {
  return (
    <div className="section-box mt-100">
        <div className="container">
            <div className="row">
                <div className="col-lg-1" />
                <div className="col-lg-10">
                    <div className="bd-bottom pb-20 mb-40 text-mb-center">
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-6 col-6 mb-30"><span className="text-display-3 color-green-900">+<CounterUp count={6} time={3}/></span>
                                <p className="text-body-text color-gray-500 pl-40t">Years in Business</p>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-6 mb-30"><span className="text-display-3 color-green-900">+<CounterUp count={14} time={3}/>k</span>
                                <p className="text-body-text color-gray-500 pl-40">Projects Done</p>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-6 mb-30"><span className="text-display-3 color-green-900">+<CounterUp count={26} time={3}/></span>
                                <p className="text-body-text color-gray-500 pl-40">Countries / Offices</p>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-6 col-6 mb-30"><span className="text-display-3 color-green-900">+<CounterUp count={24} time={3}/>k</span>
                                <p className="text-body-text color-gray-500 pl-40">Constant Clients</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-1" />
            </div>
        </div>
    </div>
  )
}

export default CounterStats