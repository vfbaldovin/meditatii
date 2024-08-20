import { Seo } from 'src/components/seo';
import React from "react";
import {Login} from "../auth/login";



const Page = () => {


  return (
    <>
      <Seo title="Login" />
        <Login></Login>
    </>
  );
};

export default Page;
