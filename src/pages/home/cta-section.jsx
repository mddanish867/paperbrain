
const CTS = () => {
    return (
        <>
            {/* Team Section */}
      <section className="py-16 md:py-24 border-t border-b border-gray-200 ">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Trusted by Development Teams Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Join thousands of developers and teams who have transformed their workflow with our platform.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                  Ready to Transform Your Development Workflow?
                </h3>
                <p className="text-blue-100">
                  Start your journey with DevAI Platform today. No credit card required.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50">
                  Start Free Trial
                </button>
                <button className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-transparent px-8 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
    )
}

export default CTS