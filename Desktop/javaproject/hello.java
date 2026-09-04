import java.util.Scanner;
class hello
{
    public static void main(String args[])
    {
        Scanner mrk=new Scanner(System.in);
        String Name=mrk.nextLine();
        float a=mrk.nextFloat();
        mrk.nextLine();
        String dep=mrk.nextLine();
        float score=a/100*10;
        System.out.println("My name is"+ Name);
        System.out.println("My score is"+ score+"/10");
        System.out.print("my department is"+ dep);

    }
}