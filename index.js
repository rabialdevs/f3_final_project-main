let globalStore = {
  ipAddr: null,
  postOfficeData: null,
};

function insertDiv(data) {
  console.log(data);
  data.forEach((element) => {
    // console.log(element);
    let html = `<div class="postoffice">
            <h5 id="name">Name :${element.office}</h5>
            <h5 id="branchtype">Branch Type :-${element.office_type}</h5>
            <h5 id="deliveryStatus">Delivery Status :- ${element.delivery}</h5>
            <h5 id="district">District :${element.district}</h5>
            <h5 id="division">Division :- ${element.division}</h5>
        </div>`;

    // console.log(document.querySelector("#postoffice"));
    document
      .querySelector("#postOfficeList")
      .insertAdjacentHTML("beforeend", html);
  });
}

// Make an HTTP GET request to ipify API
fetch("https://api.ipify.org?format=json")
  .then((response) => {
    // console.log(response);
    return response.json();
  })

  .then((data) => {
    // console.log(data);
    getData(data.ip);

    document.querySelector(
      "#ip"
    ).innerText = `MY PUBLIC IP ADDRESS IS :- ${data.ip}`;
  })
  .catch((error) => {
    document.querySelector("#ip").innerText = `DONT GET YOUR IP ADDRESS`;
  });
function getData(ipAddress) {
  // fetch('')
  globalStore.ipAddr = ipAddress;
  document.querySelector(
    "#ip"
  ).innerText = `MY PUBLIC IP ADDRESS IS :- ${ipAddress}`;
  console.log(ipAddress);
  fetch(`https://ipinfo.io/${ipAddress}/json?token=635888b56e44b1`)
    .then((resolve) => {
      return resolve.json();
    })
    .then((data) => {
      console.log(data);
      let lat = data.loc.split(",")[0];
      let long = data.loc.split(",")[1];
      const mapUrl = `<iframe src="https://maps.google.com/maps?q=${lat}, ${long}&z=15&output=embed" width="500px" height="300px"></iframe>`;
      let map = document.querySelector(".map");
      map.innerHTML = mapUrl;

      document.querySelector("#lat").innerText = `Lat:- ${
        data.loc.split(",")[0]
      }`;
      document.querySelector("#long").innerText = `Long :- ${
        data.loc.split(",")[1]
      }`;
      document.querySelector("#city").innerText = `City :- ${data.city}`;
      document.querySelector("#region").innerText = `Region : -${data.region}`;
      document.querySelector(
        "#organisation"
      ).innerText = `Organisation :-${data.org}`;
      document.querySelector(
        "#hostname"
      ).innerText = `Hostname :- ${data.hostname}`;
      document.querySelector(
        "#timeZone"
      ).innerText = `TimeZone :- ${data.timezone}`;
      let date = new Date();

      document.querySelector(
        "#dateAndTime"
      ).innerText = `Date And Time :- ${date.toLocaleTimeString()}`;
      document.querySelector(
        "#pincode"
      ).innerText = `PinCode :- ${data.postal}`;
      // Calling function to get postoffice
      getpostoffice(data.postal);
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getpostoffice(pincode) {
  // fetch(`https://api.postalpincode.in/pincode/${pincode}`)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //     document.querySelector("#message").innerHTML = `${data[0].Message}`;
  //     // calling function to insert div dynamically
  //     let postOfficeData = data[0].PostOffice;
  //     insertDiv(postOfficeData);

  //     document
  //       .querySelector("#input")
  //       .addEventListener("keyup", function (event) {
  //         // let input = this.arialValueMax.toLowercase();
  //         const searchTerm = event.target.value.toLowerCase();
  //         // console.log(searchTerm);
  //         // Clear previous results
  //         document.querySelector(".postoffice").innerHTML = "";

  //         // Filter the post offices based on name or branch office
  //         const filteredPostOffices = postOfficeData.filter((office) => {
  //           const name = office.Name.toLowerCase();
  //           const branch = office.BranchType.toLowerCase();
  //           return name.includes(searchTerm) || branch.includes(searchTerm);
  //         });
  //         console.log(filteredPostOffices)
  //         // insertDiv(filteredPostOffices);
  //       });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });

  const url = "https://pincode.p.rapidapi.com/";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "6a05af67bdmsh0c5a5addee1458fp12b2edjsnde04ef4c403e",
      "X-RapidAPI-Host": "pincode.p.rapidapi.com",
    },
    body: JSON.stringify({
      searchBy: "pincode",
      value: pincode,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.length === 0) {
      globalStore.postOfficeData = null;
    } else {
      globalStore.postOfficeData = data;
    }

    document.querySelector(
      "#message"
    ).innerHTML = `Number of post offices: ${data.length}`;
    insertDiv(data);
  } catch (error) {
    console.error(error);
  }
}

document.querySelector("#input").addEventListener("keyup", function (event) {
  // clear previous results
  document.querySelectorAll('.postoffice').forEach((el) => el.remove())

  const searchTerm = event.target.value.toLowerCase();
  if (searchTerm.length === 0) {
    insertDiv(globalStore.postOfficeData);
    return;
  }

  // Filter the post offices based on name or branch office
  const filteredPostOffices = globalStore.postOfficeData.filter(
    (officeData) => {
      // const name = office.Name.toLowerCase();
      // const branch = office.BranchType.toLowerCase();
      return officeData.office.toLowerCase().includes(searchTerm);
    }
  );
  // console.log(filteredPostOffices);
  // Clear previous results
  insertDiv(filteredPostOffices);
});
