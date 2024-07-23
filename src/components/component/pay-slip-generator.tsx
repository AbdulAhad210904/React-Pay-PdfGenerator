"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { numberToWords } from "amount-to-words";
import PayslipPDF from "./pay-slip-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

export function PaySlipGenerator() {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      employeePaySummary: {
        employeeName: "",
        employeeId: "",
        payPeriod: "",
        payDate: "",
        totalDays: "",
        lossOfPayDays: "",
        payCycle: "",
        additionalFields: [{ fieldName: "", fieldValue: "" }],
      },
      incomeDetails: {
        earnings: [{ description: "", amount: "" }],
        deductions: [{ description: "", amount: "" }],
      },
    },
  });

  const { fields: additionalFields, append: appendAdditionalFields } =
    useFieldArray({
      control,
      name: "employeePaySummary.additionalFields",
    });

  const { fields: earningsFields, append: appendEarnings } = useFieldArray({
    control,
    name: "incomeDetails.earnings",
  });

  const { fields: deductionsFields, append: appendDeductions } = useFieldArray({
    control,
    name: "incomeDetails.deductions",
  });

  const watchAllFields = watch();

  const calculateGrossEarnings = () => {
    return earningsFields.reduce((total, field, index) => {
      return (
        total +
        (parseFloat(watchAllFields.incomeDetails.earnings[index].amount) || 0)
      );
    }, 0);
  };

  const calculateGrossDeductions = () => {
    return deductionsFields.reduce((total, field, index) => {
      return (
        total +
        (parseFloat(watchAllFields.incomeDetails.deductions[index].amount) || 0)
      );
    }, 0);
  };

  const grossEarnings = calculateGrossEarnings();
  const grossDeductions = calculateGrossDeductions();
  const totalNetPayable = grossEarnings - grossDeductions;
  const amountInWords = numberToWords(totalNetPayable);

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleReset = () => {
    reset();
  };

  const formData = {
    ...watchAllFields,
    grossEarnings,
    grossDeductions,
    totalNetPayable,
    amountInWords,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-md shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-bold">Employee Pay Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee-name">Employee Name</Label>
              <Controller
                control={control}
                name="employeePaySummary.employeeName"
                render={({ field }) => <Input id="employee-name" {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-id">Employee ID</Label>
              <Controller
                control={control}
                name="employeePaySummary.employeeId"
                render={({ field }) => <Input id="employee-id" {...field} />}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pay-period">Pay Period</Label>
              <Controller
                control={control}
                name="employeePaySummary.payPeriod"
                render={({ field }) => <Input id="pay-period" {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-date">Paid Days</Label>
              <Controller
                control={control}
                name="employeePaySummary.payDate"
                render={({ field }) => <Input id="pay-date" {...field} />}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-days">Loss of Pay Days</Label>
              <Controller
                control={control}
                name="employeePaySummary.lossOfPayDays"
                render={({ field }) => <Input id="total-days" {...field} />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-cycle">Pay Date</Label>
              <Controller
                control={control}
                name="employeePaySummary.payCycle"
                render={({ field }) => <Input id="pay-cycle" {...field} />}
              />
            </div>
          </div>
          {additionalFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`additional-field-name-${index}`}>
                  Field Name
                </Label>
                <Controller
                  control={control}
                  name={`employeePaySummary.additionalFields[${index}].fieldName`}
                  render={({ field }) => (
                    <Input
                      id={`additional-field-name-${index}`}
                      {...field}
                      placeholder="Field Name"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`additional-field-value-${index}`}>
                  Field Value
                </Label>
                <Controller
                  control={control}
                  name={`employeePaySummary.additionalFields[${index}].fieldValue`}
                  render={({ field }) => (
                    <Input
                      id={`additional-field-value-${index}`}
                      {...field}
                      placeholder="Field Value"
                    />
                  )}
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              appendAdditionalFields({ fieldName: "", fieldValue: "" })
            }
          >
            Add Another Field
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-bold">Income Details</h2>
          <div className="flex gap-3">
            <div className="grid grid-cols-2 gap-4">
              {earningsFields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <div className="space-y-2">
                    <Label htmlFor={`earnings-description-${index}`}>
                      Earnings
                    </Label>
                    <Controller
                      control={control}
                      name={`incomeDetails.earnings[${index}].description`}
                      render={({ field }) => (
                        <Input
                          id={`earnings-description-${index}`}
                          {...field}
                          placeholder="Description"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`earnings-amount-${index}`}>Amount</Label>
                    <Controller
                      control={control}
                      name={`incomeDetails.earnings[${index}].amount`}
                      render={({ field }) => (
                        <Input
                          id={`earnings-amount-${index}`}
                          {...field}
                          placeholder="Amount"
                        />
                      )}
                    />
                  </div>
                </React.Fragment>
              ))}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => appendEarnings({ description: "", amount: "" })}
              >
                Add Another Field
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {deductionsFields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <div className="space-y-2">
                    <Label htmlFor={`deductions-description-${index}`}>
                      Deductions
                    </Label>
                    <Controller
                      control={control}
                      name={`incomeDetails.deductions[${index}].description`}
                      render={({ field }) => (
                        <Input
                          id={`deductions-description-${index}`}
                          {...field}
                          placeholder="Description"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`deductions-amount-${index}`}>Amount</Label>
                    <Controller
                      control={control}
                      name={`incomeDetails.deductions[${index}].amount`}
                      render={({ field }) => (
                        <Input
                          id={`deductions-amount-${index}`}
                          {...field}
                          placeholder="Amount"
                        />
                      )}
                    />
                  </div>
                </React.Fragment>
              ))}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  appendDeductions({ description: "", amount: "" })
                }
              >
                Add Another Field
              </Button>
            </div>
          </div>
        </div>
        <div className="flex mb-10">
          <div className="flex w-full justify-between">
            <span className="font-semibold text-lg">Gross Earnings:</span>{" "}
            <span className="mr-36">{grossEarnings} RS</span>
          </div>
          <div className="flex w-full justify-between ">
            <span className="font-semibold text-lg">Gross Deductions:</span>{" "}
            <span className="mr-36">{grossDeductions} RS</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="font-bold">Total Net Payable</p>
            <p className="font-bold">{totalNetPayable} RS</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Gross Earnings - Total Deductions
            </p>
            <p className="text-sm text-muted-foreground">
              {totalNetPayable} RS
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Amount in words: Rupees {amountInWords}
          </p>
        </div>

        <div className="flex space-x-4">
          <Button variant="default" type="submit">
            Generate Payslip
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
      <PDFDownloadLink
        document={<PayslipPDF data={formData} />}
        fileName="payslip.pdf"
        className="mt-4"
      >
        {({ loading }) =>
          loading ? "Loading document..." : "Download Payslip PDF"
        }
      </PDFDownloadLink>
    </div>
  );
}
