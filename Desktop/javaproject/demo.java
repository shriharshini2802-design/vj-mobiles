import java.util.Scanner;
class demo
{
    public static void main(String args[])
    {
        Scanner s=new Scanner(System.in);
        int salary=s.nextInt();
        int age=s.nextInt();
        if(salary>=20000||age<=25)
        {
            System.out.println("Eligible for loan");
            int loan=s.nextInt();
            if(loan<=50000)
            {
               System.out.println("loan amount is available");
            }
            else
            {
                System.out.println("maximum loan amount is 50000");
            }
        }
        else
        {
            System.out.println("Not eligible");
        }
    }
        
}