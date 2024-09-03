// import { React, useState, useRef } from "react";
// import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from "reactstrap";
// import { AvForm, AvField } from "availity-reactstrap-validation";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import Collecting from "../../../../img/img.png";
// import { EditProduct, addOrder } from "../../../../Store/order";




// function MOdal({isOpen,toggle,edit}) {
//   const [img, setImg] = useState("");
//   const [loader, setLoader] = useState("");
//   const useVal = useRef("");
//   const dispatch = useDispatch();

//   function Submit(event, errors, values) {
//     let value = {
//       ...values,
//       id: edit.id,
//       createdAt: edit.createdAt,
//       imageId: img ? img : edit.imageId,
//     };
//     dispatch(EditProduct(value), addOrder());
//     setImg("");
//     toggle();
//   }
//   function Upload(e) {
//     setLoader(true);
//     const onload = e.target.files[0];
//     const formData = new FormData();
//     formData.append("image", onload);
//     axios({
//       url: "https://store-management-backend-app.herokuapp.com/api/v1/attachment",
//       method: "POST",
//       timeout: 5000 ,
//       data: formData,
//     }).then((res) => {
//       setImg(res.data);
//     }) .catch(error =>{
//       console.error("Error:" , error.message);
//     })

   
//   }



//   return (
//     <Modal isOpen={isOpen} className="bgd">
//       <ModalBody >
//       <AvForm id={"f"} onSubmit={Submit} model={edit ? edit : {}}>
//             <AvField
//               className={"inpmod"}
//               label={"Product Name"}
//               name={"productName"}
//             />
//             <AvField className={"inpmod"} label={"Amount"} name={"amount"} />
//             <AvField className={"inpmod"} label={"Price"} name={"price"} />
//             <AvField
//               className={"className='float-start"}
//               label={"Description"}
//               type={"textarea"}
//               name={"description"}
//               required
//             />
//             <h5 className="d-flex justify-content-between mt-3">
//               Add Images
//               {img ? (
//                 <b
//                   className={"cancel collecting text-danger"}
//                   onClick={() => {
//                     setImg("");
//                     setLoader(false);
//                   }}
//                 >
//                   <i className="bi bi-x-lg"></i>
//                 </b>
//               ) : (
//                 ""
//               )}
//             </h5>
//             <label htmlFor={"ChooseImg"} className={"w-100"}>
//               {img ? (
//                 <div className={"selectedImg w-100"}>
//                   <img
//                     className={"w-100"}
//                     style={{borderRadius:'15px'}}
//                     src={`https://store-management-backend-app.herokuapp.com/api/v1/attachment/${img}`}
//                     alt="product"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   {
//                     <div className="img d-flex justify-content-center  align-items-center" 
//                     style={{border:'1px solid silver'}}>
//                       <img
//                         className='hs'
//                         src={Collecting}
//                         alt="Collecting"
//                         style={{width: "50%", height: "50%"}}
//                       />
//                       <div>
//                         <h3>Drop or Select file</h3>
//                       </div>
//                     </div>
//                   }
//                 </div>
//               )}
//             </label>
//             <input
//               type="file"
//               id={"ChooseImg"}
//               ref={useVal}
//               onChange={Upload}
//               className={"d-none"}
//             />
//           </AvForm>
//             <button onClick={toggle} className='btn btn-danger float-end mt-2 mx-3 '>Cancel</button>
//             <button form={'f'} className='btn btn-success float-end mx-1 mt-2' >Edite</button>
//       </ModalBody>
//     </Modal>
//   )
// }

// export default MOdal