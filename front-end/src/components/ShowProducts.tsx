import { Modal } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import AxiosInstance from "../config/AxiosInstance";
import Pop from "./cards/Pop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  unitPrice: number;
  qtyOnHand: number;
}

const ShowProducts: React.FC = () => {
  useEffect(() => {
    allProducts(currentPage);
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  const [id, setId] = useState("");

  const [modalDelete, setModalDelete] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalView, setModalView] = useState(false);

  const [updateName, setUpdateName] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [viewImage, setViewImage] = useState("");
  const [updateUnitPrice, setUpdateUnitPrice] = useState<number | "">("");
  const [updateQtyOnHand, setUpdateQtyOnHand] = useState<number | "">("");

  const [searchProduct, setSearchProduct] = useState("");

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  const [currentPage, setCurrentPage] = useState<any | "">(1);
  const [pages, setPages] = useState<any | "">(0);

  // const allProducts = async () => {
  //   try {
  //     const response = await AxiosInstance.get(`/product/findAll`);
  //     setProducts(response.data.result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const allProducts = async (currentPage: any) => {
    try {
      const response = await AxiosInstance.get(
        `/product/findAll?page=${currentPage}`
      );
      setProducts(response.data.result);
      setPages(response.data.pages);
      console.log(`current page is ${currentPage}`);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    console.log(`active page is ${pageNumber}`);
    allProducts(pageNumber);
  };

  // Basic Pagination Control
  const Pagination = ({ pages, currentPage }: any) => {
    // Handler for the Previous page
    console.log(currentPage);
    const handlePrevPage = () => {
      console.log("Previous page");
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };

    // Handler for the Next page
    const handleNextPage = () => {
      console.log("Next page");
      if (currentPage < pages) {
        handlePageChange(currentPage + 1);
      }
    };

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button onClick={handlePrevPage} className="page-link btn">
              Previous
            </button>
          </li>
          {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <a onClick={() => handlePageChange(page)} className="page-link">
                {page}
              </a>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === pages ? "disabled" : ""}`}
          >
            <button
              onClick={handleNextPage}
              className="page-link btn btn-primary"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const findProduct = async (id: string) => {
    try {
      setId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await AxiosInstance.delete(`/product/delete/${id}`);

      allProducts(currentPage);
      setModalDelete(false);
      popRef.current?.notify("Delete successfully", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const findUpdateProduct = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/product/find-by-id/${id}`);
      setId(id);
      setUpdateName(response.data.result.name);
      setUpdateDescription(response.data.result.description);
      setUpdateUnitPrice(response.data.result.unitPrice);
      setUpdateQtyOnHand(response.data.result.qtyOnHand);
      console.log(response.data.result);

      setViewImage(response.data.result.image);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async (
    id: string,
    name: string,
    description: string,
    // image: string,
    unitPrice: any,
    qtyOnHand: any
  ) => {
    try {
      const response = await AxiosInstance.put(`/product/update-by-id/${id}`, {
        name,
        description,
        // image,
        unitPrice,
        qtyOnHand,
      });

      console.log(response.data);
      setModalUpdate(false);
      popRef.current?.notify("Update successfully", "success");
      allProducts(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (searchText: string) => {
    try {
      if (searchText != "") {
        const response = await AxiosInstance.get(
          `/product/search/${searchText}`
        );

        setProducts(response.data.response);
        console.log(response.data.message);
      } else {
        allProducts(currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const styleObj: React.CSSProperties = {
  //   marginBottom: "20px",
  // };

  return (
    <>
      <Pop ref={popRef} />
      <br />
      <div className="container-fluid">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Products
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-12">
              <h1>Products</h1>
            </div>
            <div className="col-12 my-3">
              <form className="col-12">
                <input
                  value={searchProduct}
                  type="search"
                  className="form-control"
                  placeholder="Search Product"
                  onChange={(e) => {
                    setSearchProduct(e.target.value);
                  }}
                  onKeyUp={() => search(searchProduct)}
                />
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-hover table bordered text-center">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    {/* <th>Description</th> */}
                    <th>Unit Price</th>
                    <th>QTY</th>
                    <th>Delete Product</th>
                    <th>Update Product</th>
                    <th>View Product</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    return (
                      <tr key={index}>
                        <td># {index}</td>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "30px", height: "auto" }}
                          />
                        </td>
                        <td>{product.name}</td>
                        {/* <td>{product.description}</td> */}
                        <td>{product.unitPrice}</td>
                        <td>{product.qtyOnHand}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              findProduct(product._id);
                              setModalDelete(true);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => {
                              findUpdateProduct(product._id);
                              setModalUpdate(true);
                            }}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              findUpdateProduct(product._id);
                              setModalView(true);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pages={pages} currentPage={currentPage} />
        </div>
      </div>

      {/* Pop up modals */}

      <Modal show={modalDelete}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Product</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <span
                  style={{ fontSize: "25px" }}
                  aria-hidden="true"
                  onClick={() => {
                    setModalDelete(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setModalDelete(false);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  deleteCustomer(id);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={modalUpdate}>
        <div className="row">
          <div className="p-4">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2>Update Product</h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <span
                  style={{ fontSize: "25px" }}
                  aria-hidden="true"
                  onClick={() => {
                    setModalUpdate(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <br />
            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateUnitPrice}
                  onChange={(e) => {
                    setUpdateUnitPrice(parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateQtyOnHand}
                  onChange={(e) => {
                    setUpdateQtyOnHand(parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>
            <br />
            <textarea
              value={updateDescription}
              rows={5}
              className="form-control"
              id="description"
              onChange={(e) => {
                setUpdateDescription(e.target.value);
              }}
            />

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setModalUpdate(false);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  updateProduct(
                    id,
                    updateName,
                    updateDescription,
                    updateUnitPrice,
                    updateQtyOnHand
                  );
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={modalView}>
        <div className="row">
          <div className="p-4">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2>{updateName}</h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <span
                  style={{ fontSize: "25px" }}
                  aria-hidden="true"
                  onClick={() => {
                    setModalView(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <br />
            <div className="col-12">
              <img src={viewImage} className="img-fluid" alt="" />
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <label htmlFor="unitPrice">Unit Price:</label>
                <input
                  type="text"
                  className="form-control"
                  value={updateUnitPrice}
                  disabled
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <label htmlFor="qty">QTY:</label>
                <input
                  type="text"
                  className="form-control"
                  value={updateQtyOnHand}
                  disabled
                />
              </div>
            </div>
            <br />
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                value={updateDescription}
                rows={5}
                className="form-control"
                id="description"
                disabled
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                data-dismiss="modal"
                onClick={() => {
                  setModalView(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowProducts;
