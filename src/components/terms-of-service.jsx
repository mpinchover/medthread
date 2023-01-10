const TermsOfService = () => {
  return (
    <div className="py-4  w-full text-md px-28 ">
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">HIPAA</div>
        <div>
          MedThread is a HIPAA covered entity. Personal health information
          provided to MedThread is protected by HIPAA.
        </div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">Data usage</div>
        <div>
          MedThread primarily uses any data collected to create a full and
          complete patient history for providers to give the best quality
          healthcare.
        </div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">External data sharing</div>
        <div>At this time we do not share data externally.</div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">Who we sell data to</div>
        <div>At this time we do not sell data.</div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">Data storage</div>
        <div>Data is stored on our servers provisioned by Google.</div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">Data encryption</div>
        <div>
          All data is encrypted either through hasing or through HTTPS. Data
          records stored in our database do not store personal information. All
          healthcare records require authenticated access. Healthcare data is
          never stored on your device.
        </div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">
          Delete your account & records
        </div>
        <div>
          Contact us to terminate your account and any healthcare records stored
          with us.
        </div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">
          Changes in policies and terms of service.
        </div>
        <div>
          We will contact the email provided to notify of any changes in
          policies or terms of service.
        </div>
      </section>
      <section className="mb-8">
        <div className="text-xl font-bold mb-1">Contact</div>
        <div>info@usemedthread.com</div>
      </section>
    </div>
  );
};

export default TermsOfService;
