import React from 'react'
import {Button, Form, Table} from "react-bootstrap"
import {useTable,usePagination,useRowSelect} from "react-table"

import {SelectCheckbox} from "../components"

const TableComponent = ({columns,data}) => {
  console.log(columns);
  const {getTableProps,getTableBodyProps,page,prepareRow,headerGroups,state,pageOptions,nextPage,previousPage,canNextPage,gotoPage,canPreviousPage,selectedFlatRows}=useTable({columns,data:data||[]},usePagination,useRowSelect,hooks=>
    hooks.visibleColumns.push(columns=>{
      return [
        {
          id:"selection",
          Header:(({getToggleAllRowsSelectedProps})=><SelectCheckbox {...getToggleAllRowsSelectedProps()}/>),
          Cell:({row})=>(<SelectCheckbox {...row.getToggleRowSelectedProps()}/>)
        },
        ...columns
      ]
    }))
  const {pageIndex}=state;
  return (
    <div className='d-flex flex-column align-items-center'>
     <Table responsive bordered hovered striped {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup=>(
          <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column=>(
                <th  {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
          </tr>
        ))}
          </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row=>{
                prepareRow(row);
                return (
                  <tr>
                    {row.cells.map(cell=>(
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          
      
    </Table>
    <div className="bottom">
            <div className="d-flex align-items-center">
              <Button disabled={!canPreviousPage} onClick={()=>previousPage()}>Previous</Button>
              <Form.Control type="number" defaultValue={1} onChange={e=>{
                const pageIndex=+e.target.value-1;
                gotoPage(pageIndex);

              }}/>
              <Button disabled={!canNextPage} onClick={()=>nextPage()}>Next</Button>
            </div>
            <p className='text-center mt-3'><strong>{pageIndex+1}</strong> Of {pageOptions.length}</p>
    </div>
   
    </div>
   
  )
}

export default TableComponent;