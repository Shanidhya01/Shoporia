import React from 'react'
import "./Styles/Pagination.css";
import { useSelector } from 'react-redux';

function Pagination({
  currentPage,
  activeClass='active',
  onPageChange,
  nextPageText='Next',
  prevPageText='Prev',
  firstPageText='1st',
  lastPageText='Last',
}) {
  const { totalPages,products } = useSelector((state) => state.product);
  if(products.length === 0 || totalPages <=1) return null;

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2; 
    for(let i=Math.max(1, currentPage - pageWindow); i<=Math.min(totalPages, currentPage + pageWindow); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
  return (
    <div className='pagination'>
      {/* Previous and first page buttons */}
      {currentPage > 1 && (
        <>
          <button className='pagination-btn' onClick={() => onPageChange(1)}>{firstPageText}</button>
          <button className='pagination-btn' onClick={() => onPageChange(currentPage - 1)}>{prevPageText}</button>
        </>
      )}
      {/* Display Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? activeClass : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      {/* Next and last page buttons */}
      {currentPage < totalPages && (
        <>
          <button className='pagination-btn' onClick={() => onPageChange(currentPage + 1)}>{nextPageText}</button>
          <button className='pagination-btn' onClick={() => onPageChange(totalPages)}>{lastPageText}</button>
        </>
      )}

    </div>
  )
}

export default Pagination
